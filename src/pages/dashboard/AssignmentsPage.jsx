import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/layout/PageHeader';
import { api } from '../../services/mockApi';
import { formatDate, formatDateTime, uid } from '../../utils/format';
import { useNotifications } from '../../contexts/NotificationContext';

const initialAssignmentForm = {
  title: '',
  courseId: 'CS401',
  dueDate: '',
  description: '',
};

export function AssignmentsPage() {
  const { pushToast } = useNotifications();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeAssignmentId, setActiveAssignmentId] = useState('');
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradingForm, setGradingForm] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    Promise.all([api.assignments.list(), api.assignments.submissions()]).then(([assignmentData, submissionData]) => {
      setAssignments(assignmentData);
      setSubmissions(submissionData);
      setActiveAssignmentId(assignmentData[0]?.id ?? '');
    });
  }, []);

  const activeAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === activeAssignmentId),
    [assignments, activeAssignmentId],
  );

  const visibleSubmissions = useMemo(
    () => submissions.filter((submission) => submission.assignmentId === activeAssignmentId),
    [submissions, activeAssignmentId],
  );

  const createAssignment = (event) => {
    event.preventDefault();

    if (!assignmentForm.title || !assignmentForm.dueDate) {
      pushToast({ type: 'warning', title: 'Missing required fields', message: 'Assignment title and due date are required.' });
      return;
    }

    const createdAssignment = {
      id: uid('ASG'),
      status: 'Open',
      submissions: 0,
      totalStudents: 45,
      ...assignmentForm,
    };

    setAssignments((current) => [createdAssignment, ...current]);
    setAssignmentForm(initialAssignmentForm);
    setActiveAssignmentId(createdAssignment.id);

    pushToast({
      type: 'success',
      title: 'Assignment created',
      message: `${createdAssignment.title} is now visible to enrolled students.`,
    });
  };

  const openGradingModal = (submission) => {
    setGradingSubmission(submission);
    setGradingForm({
      grade: submission.grade ?? '',
      feedback: submission.feedback ?? '',
    });
    setGradeModalOpen(true);
  };

  const saveGrading = (event) => {
    event.preventDefault();

    if (gradingForm.grade === '' || Number(gradingForm.grade) < 0 || Number(gradingForm.grade) > 100) {
      pushToast({
        type: 'warning',
        title: 'Invalid grade',
        message: 'Grade must be between 0 and 100.',
      });
      return;
    }

    setSubmissions((current) =>
      current.map((submission) => {
        if (submission.id !== gradingSubmission.id) return submission;

        return {
          ...submission,
          grade: Number(gradingForm.grade),
          feedback: gradingForm.feedback,
          status: 'Graded',
        };
      }),
    );

    setGradeModalOpen(false);
    pushToast({ type: 'success', title: 'Grade saved', message: 'Student has been notified with updated feedback.' });
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Assignments & Grading"
        description="Create assignments, monitor submissions, and publish grading feedback."
      />

      <div className="dashboard-columns">
        <Card title="Create Assignment" subtitle="Configure assignment details for class publication">
          <form className="form-grid" onSubmit={createAssignment}>
            <InputField
              id="assignment-title"
              label="Assignment Title"
              value={assignmentForm.title}
              onChange={(value) => setAssignmentForm((current) => ({ ...current, title: value }))}
              placeholder="e.g., Frontend Architecture Case Study"
            />

            <div className="form-control">
              <label htmlFor="assignment-course">Course</label>
              <select
                id="assignment-course"
                value={assignmentForm.courseId}
                onChange={(event) => setAssignmentForm((current) => ({ ...current, courseId: event.target.value }))}
              >
                <option value="CS401">CS401</option>
                <option value="CS307">CS307</option>
                <option value="CS205">CS205</option>
              </select>
            </div>

            <InputField
              id="assignment-due-date"
              label="Due Date"
              type="date"
              value={assignmentForm.dueDate}
              onChange={(value) => setAssignmentForm((current) => ({ ...current, dueDate: value }))}
            />

            <div className="form-control full-width">
              <label htmlFor="assignment-description">Description</label>
              <textarea
                id="assignment-description"
                rows={4}
                value={assignmentForm.description}
                onChange={(event) =>
                  setAssignmentForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Describe submission format, grading rubric, and academic integrity expectations."
              />
            </div>

            <div className="full-width">
              <Button type="submit">Publish Assignment</Button>
            </div>
          </form>
        </Card>

        <Card title="Assignments List" subtitle={`${assignments.length} assignments configured`}>
          <div className="list-with-gaps">
            {assignments.map((assignment) => (
              <article
                className={`list-item ${activeAssignmentId === assignment.id ? 'active' : ''}`.trim()}
                key={assignment.id}
                onClick={() => setActiveAssignmentId(assignment.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setActiveAssignmentId(assignment.id);
                  }
                }}
              >
                <div>
                  <strong>{assignment.title}</strong>
                  <p>
                    {assignment.courseId} · Due {formatDate(assignment.dueDate)}
                  </p>
                </div>
                <Badge tone={assignment.status === 'Open' ? 'success' : assignment.status === 'Closing Soon' ? 'warning' : 'default'}>
                  {assignment.status}
                </Badge>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Submissions"
        subtitle={
          activeAssignment
            ? `${activeAssignment.submissions}/${activeAssignment.totalStudents} students submitted`
            : 'Select an assignment to inspect submissions'
        }
      >
        {!activeAssignment ? (
          <EmptyState
            icon="📝"
            title="No assignment selected"
            description="Select an assignment from the list to view submissions."
          />
        ) : visibleSubmissions.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No submissions yet"
            description="Student submissions will appear here when available."
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.studentName}</td>
                    <td>{formatDateTime(submission.submittedAt)}</td>
                    <td>
                      <Badge tone={submission.status === 'Graded' ? 'success' : 'warning'}>{submission.status}</Badge>
                    </td>
                    <td>{submission.grade ?? '—'}</td>
                    <td>{submission.feedback || 'No feedback shared yet.'}</td>
                    <td>
                      <button className="text-link" onClick={() => openGradingModal(submission)} type="button">
                        {submission.status === 'Graded' ? 'Update Grade' : 'Grade'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        title={gradingSubmission ? `Grade Submission · ${gradingSubmission.studentName}` : 'Grade Submission'}
        open={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="grading-form">
              Save Grade
            </Button>
          </>
        }
      >
        {gradingSubmission ? (
          <form id="grading-form" className="form-grid" onSubmit={saveGrading}>
            <InputField
              id="grade-score"
              type="number"
              label="Grade (0-100)"
              value={gradingForm.grade}
              onChange={(value) => setGradingForm((current) => ({ ...current, grade: value }))}
              min="0"
              max="100"
            />
            <div className="form-control full-width">
              <label htmlFor="grade-feedback">Feedback</label>
              <textarea
                id="grade-feedback"
                rows={5}
                value={gradingForm.feedback}
                onChange={(event) => setGradingForm((current) => ({ ...current, feedback: event.target.value }))}
                placeholder="Share strengths, gaps, and next-step guidance for improvement."
              />
            </div>
          </form>
        ) : null}
      </Modal>
    </section>
  );
}
