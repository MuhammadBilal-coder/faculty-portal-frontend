import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { InputField } from '../../components/common/InputField';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/layout/PageHeader';
import { BATCHES, DEPARTMENTS } from '../../constants/appConstants';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { api } from '../../services/mockApi';
import { paginate } from '../../utils/format';
import { useNotifications } from '../../contexts/NotificationContext';

const pageSize = 5;

export function StudentsPage() {
  const { pushToast } = useNotifications();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileStudent, setProfileStudent] = useState(null);

  const debouncedQuery = useDebouncedValue(query, 250);

  useEffect(() => {
    api.students.list().then(setStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();

    return students.filter((student) => {
      const matchesText =
        student.name.toLowerCase().includes(normalized) ||
        student.id.toLowerCase().includes(normalized) ||
        student.email.toLowerCase().includes(normalized);

      const matchesDepartment = departmentFilter === 'All' || student.department === departmentFilter;
      const matchesBatch = batchFilter === 'All' || student.batch === batchFilter;
      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

      return matchesText && matchesDepartment && matchesBatch && matchesStatus;
    });
  }, [students, debouncedQuery, departmentFilter, batchFilter, statusFilter]);

  const pagination = useMemo(
    () => paginate(filteredStudents, currentPage, pageSize),
    [filteredStudents, currentPage],
  );

  useEffect(() => {
    if (currentPage > pagination.totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, pagination.totalPages]);

  const toggleSelection = (studentId) => {
    setSelectedIds((current) =>
      current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId],
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = pagination.items.map((student) => student.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((current) => current.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((current) => [...new Set([...current, ...currentPageIds])]);
    }
  };

  const performBulkAction = (action) => {
    if (!selectedIds.length) {
      pushToast({ type: 'warning', title: 'No students selected', message: 'Select at least one student first.' });
      return;
    }

    pushToast({
      type: 'success',
      title: `Bulk action executed: ${action}`,
      message: `${selectedIds.length} student record(s) processed.`,
    });
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Students Management"
        description="Search, filter, and monitor student performance with batch and status controls."
      />

      <Card>
        <div className="toolbar-grid toolbar-grid-wide">
          <InputField
            id="students-query"
            label="Search"
            value={query}
            onChange={setQuery}
            placeholder="Search by name, ID, or email"
          />

          <div className="form-control">
            <label htmlFor="department-filter">Department</label>
            <select id="department-filter" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              <option value="All">All</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="batch-filter">Batch</label>
            <select id="batch-filter" value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)}>
              <option value="All">All</option>
              {BATCHES.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="status-filter">Status</label>
            <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="On Probation">On Probation</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      <Card
        title="Students List"
        subtitle={`${filteredStudents.length} student records`}
        actions={
          <div className="bulk-actions">
            <Button variant="ghost" onClick={() => performBulkAction('Send Reminder')}>
              Send Reminder
            </Button>
            <Button variant="ghost" onClick={() => performBulkAction('Mark Advising')}>
              Flag Advising
            </Button>
          </div>
        }
      >
        {pagination.items.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No students found"
            description="Adjust filters or search query to locate records."
          />
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={
                          pagination.items.length > 0 &&
                          pagination.items.every((student) => selectedIds.includes(student.id))
                        }
                        aria-label="Select all students in current page"
                      />
                    </th>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Batch</th>
                    <th>Status</th>
                    <th>Attendance</th>
                    <th>GPA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.items.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleSelection(student.id)}
                          aria-label={`Select ${student.name}`}
                        />
                      </td>
                      <td>{student.name}</td>
                      <td>{student.id}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.batch}</td>
                      <td>
                        <Badge
                          tone={
                            student.status === 'Active'
                              ? 'success'
                              : student.status === 'On Probation'
                                ? 'warning'
                                : 'default'
                          }
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td>{student.attendance}%</td>
                      <td>{student.gpa}</td>
                      <td>
                        <button type="button" className="text-link" onClick={() => setProfileStudent(student)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-bar" role="navigation" aria-label="Students pagination">
              <Button variant="ghost" disabled={pagination.currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                Previous
              </Button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages || 1}
              </span>
              <Button
                variant="ghost"
                disabled={pagination.currentPage >= (pagination.totalPages || 1)}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>

      <Modal
        title={profileStudent ? `Student Profile · ${profileStudent.name}` : 'Student Profile'}
        open={Boolean(profileStudent)}
        onClose={() => setProfileStudent(null)}
        footer={<Button onClick={() => setProfileStudent(null)}>Close</Button>}
      >
        {profileStudent ? (
          <div className="detail-list">
            <div>
              <strong>Name</strong>
              <p>{profileStudent.name}</p>
            </div>
            <div>
              <strong>Student ID</strong>
              <p>{profileStudent.id}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{profileStudent.email}</p>
            </div>
            <div>
              <strong>Department</strong>
              <p>{profileStudent.department}</p>
            </div>
            <div>
              <strong>Batch</strong>
              <p>{profileStudent.batch}</p>
            </div>
            <div>
              <strong>Status</strong>
              <p>{profileStudent.status}</p>
            </div>
            <div>
              <strong>Attendance</strong>
              <p>{profileStudent.attendance}%</p>
            </div>
            <div>
              <strong>GPA</strong>
              <p>{profileStudent.gpa}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
