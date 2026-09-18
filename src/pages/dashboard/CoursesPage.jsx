import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { InputField } from '../../components/common/InputField';
import { PageHeader } from '../../components/layout/PageHeader';
import { api } from '../../services/mockApi';
import { useNotifications } from '../../contexts/NotificationContext';

const initialCourseForm = {
  title: '',
  code: '',
  studentCount: 0,
  status: 'Active',
  semester: '',
  schedule: '',
  room: '',
  description: '',
};

export function CoursesPage() {
  const { pushToast } = useNotifications();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    api.courses.list().then((response) => {
      setCourses(response);
      setSelectedCourse(response[0] ?? null);
    });
  }, []);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [courses, searchTerm, statusFilter],
  );

  const openCreateModal = () => {
    setEditingCourse(null);
    setCourseForm(initialCourseForm);
    setOpenModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      code: course.code,
      studentCount: course.studentCount,
      status: course.status,
      semester: course.semester,
      schedule: course.schedule,
      room: course.room,
      description: course.description,
    });
    setOpenModal(true);
  };

  const submitCourseForm = async (event) => {
    event.preventDefault();

    if (!courseForm.title || !courseForm.code) {
      pushToast({
        type: 'warning',
        title: 'Course form incomplete',
        message: 'Course title and code are required fields.',
      });
      return;
    }

    if (editingCourse) {
      const updated = await api.courses.update({ ...editingCourse, ...courseForm });
      setCourses((current) => current.map((course) => (course.id === updated.id ? updated : course)));
      setSelectedCourse(updated);
      pushToast({ type: 'success', title: 'Course updated', message: `${updated.title} has been updated.` });
    } else {
      const created = await api.courses.create(courseForm);
      setCourses((current) => [created, ...current]);
      setSelectedCourse(created);
      pushToast({ type: 'success', title: 'Course created', message: `${created.title} is now available.` });
    }

    setOpenModal(false);
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Courses Management"
        description="Manage course catalogs, schedules, sections, and enrollment metadata."
        actions={<Button onClick={openCreateModal}>Create Course</Button>}
      />

      <Card>
        <div className="toolbar-grid">
          <InputField
            id="course-search"
            label="Search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by title, code, or keyword"
          />

          <div className="form-control">
            <label htmlFor="course-status-filter">Status</label>
            <select
              id="course-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="course-grid">
        <Card title="Course Catalog" subtitle={`${filteredCourses.length} courses found`}>
          {filteredCourses.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No courses matched your filters"
              description="Try adjusting your search query or status filter."
              action={<Button variant="secondary" onClick={() => setSearchTerm('')}>Reset search</Button>}
            />
          ) : (
            <div className="course-card-list">
              {filteredCourses.map((course) => (
                <article key={course.id} className="course-card">
                  <div>
                    <h4>{course.title}</h4>
                    <p>{course.code} · {course.semester}</p>
                  </div>
                  <div className="course-meta">
                    <Badge tone={course.status === 'Active' ? 'success' : 'warning'}>{course.status}</Badge>
                    <span>{course.studentCount} students</span>
                  </div>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <button type="button" className="text-link" onClick={() => setSelectedCourse(course)}>
                      Details
                    </button>
                    <Link className="text-link" to={`/app/courses/${course.id}`}>
                      Open Page
                    </Link>
                    <button type="button" className="text-link" onClick={() => openEditModal(course)}>
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card title="Course Details" subtitle={selectedCourse ? selectedCourse.title : 'Select a course'}>
          {selectedCourse ? (
            <div className="detail-list">
              <div>
                <strong>Course Code</strong>
                <p>{selectedCourse.code}</p>
              </div>
              <div>
                <strong>Semester</strong>
                <p>{selectedCourse.semester}</p>
              </div>
              <div>
                <strong>Schedule</strong>
                <p>{selectedCourse.schedule}</p>
              </div>
              <div>
                <strong>Classroom</strong>
                <p>{selectedCourse.room}</p>
              </div>
              <div>
                <strong>Enrolled Students</strong>
                <p>{selectedCourse.studentCount}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>{selectedCourse.status}</p>
              </div>
              <div>
                <strong>Description</strong>
                <p>{selectedCourse.description}</p>
              </div>
            </div>
          ) : (
            <EmptyState
              icon="🧭"
              title="No course selected"
              description="Choose a course from the catalog to inspect details."
            />
          )}
        </Card>
      </div>

      <Modal
        title={editingCourse ? 'Edit Course' : 'Create Course'}
        open={openModal}
        onClose={() => setOpenModal(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="course-form">
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </>
        }
      >
        <form id="course-form" className="form-grid" onSubmit={submitCourseForm}>
          <InputField
            id="course-title"
            label="Course Title"
            value={courseForm.title}
            onChange={(value) => setCourseForm((current) => ({ ...current, title: value }))}
            placeholder="e.g., Advanced Web Engineering"
            required
          />
          <InputField
            id="course-code"
            label="Course Code"
            value={courseForm.code}
            onChange={(value) => setCourseForm((current) => ({ ...current, code: value }))}
            placeholder="e.g., CS-401"
            required
          />
          <InputField
            id="course-semester"
            label="Semester"
            value={courseForm.semester}
            onChange={(value) => setCourseForm((current) => ({ ...current, semester: value }))}
            placeholder="Fall 2026"
          />
          <InputField
            id="course-schedule"
            label="Schedule"
            value={courseForm.schedule}
            onChange={(value) => setCourseForm((current) => ({ ...current, schedule: value }))}
            placeholder="Mon, Wed 10:30 AM"
          />
          <InputField
            id="course-room"
            label="Classroom"
            value={courseForm.room}
            onChange={(value) => setCourseForm((current) => ({ ...current, room: value }))}
            placeholder="Lab B-204"
          />
          <div className="form-control">
            <label htmlFor="course-status">Status</label>
            <select
              id="course-status"
              value={courseForm.status}
              onChange={(event) => setCourseForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="form-control full-width">
            <label htmlFor="course-description">Description</label>
            <textarea
              id="course-description"
              value={courseForm.description}
              onChange={(event) => setCourseForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              placeholder="Describe learning outcomes and scope"
            />
          </div>
        </form>
      </Modal>
    </section>
  );
}
