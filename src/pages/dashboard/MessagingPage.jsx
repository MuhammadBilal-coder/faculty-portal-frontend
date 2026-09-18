import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/layout/PageHeader';
import { api } from '../../services/mockApi';
import { formatDateTime } from '../../utils/format';
import { useNotifications } from '../../contexts/NotificationContext';

const initialCompose = {
  to: '',
  subject: '',
  content: '',
};

export function MessagingPage() {
  const { pushToast } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState(initialCompose);

  useEffect(() => {
    api.messages.list().then((payload) => {
      setMessages(payload);
      setSelectedMessage(payload[0] ?? null);
    });
  }, []);

  const visibleMessages = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return messages.filter((message) => {
      return (
        message.subject.toLowerCase().includes(normalizedSearch) ||
        message.sender.toLowerCase().includes(normalizedSearch) ||
        message.content.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [messages, search]);

  const unreadCount = useMemo(() => messages.filter((message) => message.unread).length, [messages]);

  const selectMessage = (message) => {
    setSelectedMessage(message);

    if (message.unread) {
      setMessages((current) =>
        current.map((item) => (item.id === message.id ? { ...item, unread: false } : item)),
      );
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!composeForm.to || !composeForm.subject || !composeForm.content) {
      pushToast({ type: 'warning', title: 'Compose message', message: 'Recipient, subject, and message content are required.' });
      return;
    }

    const newMessage = await api.messages.send({
      sender: 'You',
      subject: composeForm.subject,
      content: composeForm.content,
      unread: false,
      category: 'Sent',
    });

    setMessages((current) => [newMessage, ...current]);
    setComposeForm(initialCompose);
    setComposeOpen(false);

    pushToast({
      type: 'success',
      title: 'Message sent',
      message: `Your message was sent to ${composeForm.to}.`,
    });
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Messaging Inbox"
        description="Stay connected with students, faculty, and administrative offices."
        actions={
          <Button onClick={() => setComposeOpen(true)}>
            Compose Message
            {unreadCount > 0 ? <Badge tone="danger">{unreadCount} unread</Badge> : null}
          </Button>
        }
      />

      <Card>
        <InputField
          id="message-search"
          label="Search messages"
          value={search}
          onChange={setSearch}
          placeholder="Search by sender, subject, or content"
        />
      </Card>

      <div className="message-layout">
        <Card title="Inbox" subtitle={`${visibleMessages.length} messages`}>
          {visibleMessages.length === 0 ? (
            <EmptyState
              icon="📭"
              title="Inbox is clear"
              description="No messages matched your search query."
            />
          ) : (
            <ul className="message-list">
              {visibleMessages.map((message) => (
                <li key={message.id} className={selectedMessage?.id === message.id ? 'active' : ''}>
                  <button type="button" onClick={() => selectMessage(message)}>
                    <div>
                      <strong>{message.subject}</strong>
                      <p>
                        {message.sender} · {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                    {message.unread ? <Badge tone="info">Unread</Badge> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Message Detail">
          {selectedMessage ? (
            <article className="message-detail">
              <header>
                <h3>{selectedMessage.subject}</h3>
                <p>
                  From {selectedMessage.sender} · {formatDateTime(selectedMessage.timestamp)}
                </p>
                <Badge tone="default">{selectedMessage.category}</Badge>
              </header>
              <p>{selectedMessage.content}</p>
              <footer>
                <Button variant="secondary" onClick={() => setComposeOpen(true)}>
                  Reply
                </Button>
              </footer>
            </article>
          ) : (
            <EmptyState
              icon="✉️"
              title="No message selected"
              description="Select a message from inbox to read complete details."
            />
          )}
        </Card>
      </div>

      <Modal
        title="Compose New Message"
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="compose-form">
              Send Message
            </Button>
          </>
        }
      >
        <form id="compose-form" className="form-grid" onSubmit={sendMessage}>
          <InputField
            id="compose-to"
            label="Recipient"
            value={composeForm.to}
            onChange={(value) => setComposeForm((current) => ({ ...current, to: value }))}
            placeholder="student@university.edu"
          />
          <InputField
            id="compose-subject"
            label="Subject"
            value={composeForm.subject}
            onChange={(value) => setComposeForm((current) => ({ ...current, subject: value }))}
            placeholder="Subject"
          />
          <div className="form-control full-width">
            <label htmlFor="compose-content">Message</label>
            <textarea
              id="compose-content"
              rows={7}
              value={composeForm.content}
              onChange={(event) => setComposeForm((current) => ({ ...current, content: event.target.value }))}
              placeholder="Write your message with clear academic context and required actions."
            />
          </div>
        </form>
      </Modal>
    </section>
  );
}
