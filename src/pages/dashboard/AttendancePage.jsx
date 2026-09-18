import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/layout/PageHeader';
import { ATTENDANCE_STATUSES } from '../../constants/appConstants';
import { api } from '../../services/mockApi';
import { formatDate } from '../../utils/format';
import { useNotifications } from '../../contexts/NotificationContext';

const initialMarkAttendanceForm = {
  courseId: 'CS401',
  date: new Date().toISOString().slice(0, 10),
  present: 0,
  absent: 0,
  late: 0,
  excused: 0,
};

export function AttendancePage() {
  const { pushToast } = useNotifications();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [recordForm, setRecordForm] = useState(initialMarkAttendanceForm);
  const [markModalOpen, setMarkModalOpen] = useState(false);

  useEffect(() => {
    api.attendance.list().then(setAttendanceRecords);
  }, []);

  const filteredRecords = useMemo(
    () =>
      attendanceRecords.filter((record) => selectedCourse === 'All' || record.courseId === selectedCourse),
    [attendanceRecords, selectedCourse],
  );

  const attendanceSummary = useMemo(() => {
    if (!filteredRecords.length) {
      return {
        sessions: 0,
        avgPresent: 0,
        avgAbsent: 0,
        avgLate: 0,
      };
    }

    const totals = filteredRecords.reduce(
      (accumulator, record) => ({
        present: accumulator.present + record.present,
        absent: accumulator.absent + record.absent,
        late: accumulator.late + record.late,
      }),
      { present: 0, absent: 0, late: 0 },
    );

    return {
      sessions: filteredRecords.length,
      avgPresent: Math.round(totals.present / filteredRecords.length),
      avgAbsent: Math.round(totals.absent / filteredRecords.length),
      avgLate: Math.round(totals.late / filteredRecords.length),
    };
  }, [filteredRecords]);

  const markAttendance = async (event) => {
    event.preventDefault();

    const payload = {
      courseId: recordForm.courseId,
      date: recordForm.date,
      present: Number(recordForm.present),
      absent: Number(recordForm.absent),
      late: Number(recordForm.late),
      excused: Number(recordForm.excused),
    };

    const total = payload.present + payload.absent + payload.late + payload.excused;
    if (total <= 0) {
      pushToast({ type: 'warning', title: 'Invalid totals', message: 'At least one attendance count must be greater than zero.' });
      return;
    }

    const createdRecord = await api.attendance.mark(payload);
    setAttendanceRecords((current) => [createdRecord, ...current]);
    setMarkModalOpen(false);
    setRecordForm(initialMarkAttendanceForm);
    pushToast({ type: 'success', title: 'Attendance recorded', message: 'Attendance session saved successfully.' });
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Attendance System"
        description="Track session-wise attendance, monitor trends, and export summarized records."
        actions={<Button onClick={() => setMarkModalOpen(true)}>Mark Attendance</Button>}
      />

      <div className="stats-grid compact">
        <article className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div>
            <p>Sessions Recorded</p>
            <h3>{attendanceSummary.sessions}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <p>Average Present</p>
            <h3>{attendanceSummary.avgPresent}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon">❌</div>
          <div>
            <p>Average Absent</p>
            <h3>{attendanceSummary.avgAbsent}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div>
            <p>Average Late</p>
            <h3>{attendanceSummary.avgLate}</h3>
          </div>
        </article>
      </div>

      <Card
        title="Attendance Calendar"
        subtitle="Session-wise attendance overview"
        actions={
          <div className="toolbar-inline">
            <label htmlFor="attendance-course">Course</label>
            <select
              id="attendance-course"
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
            >
              <option value="All">All Courses</option>
              <option value="CS401">CS401</option>
              <option value="CS307">CS307</option>
              <option value="CS205">CS205</option>
            </select>
            <Button
              variant="secondary"
              onClick={() =>
                pushToast({
                  type: 'info',
                  title: 'Export prepared',
                  message: 'Attendance export has been prepared for download in CSV format.',
                })
              }
            >
              Export Data
            </Button>
          </div>
        }
      >
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                {ATTENDANCE_STATUSES.map((status) => (
                  <th key={status}>{status}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const total = record.present + record.absent + record.late + record.excused;
                return (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.courseId}</td>
                    <td>{record.present}</td>
                    <td>{record.absent}</td>
                    <td>{record.late}</td>
                    <td>{record.excused}</td>
                    <td>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title="Mark Attendance"
        open={markModalOpen}
        onClose={() => setMarkModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="attendance-form">
              Save Attendance
            </Button>
          </>
        }
      >
        <form id="attendance-form" className="form-grid" onSubmit={markAttendance}>
          <div className="form-control">
            <label htmlFor="mark-course">Course</label>
            <select
              id="mark-course"
              value={recordForm.courseId}
              onChange={(event) => setRecordForm((current) => ({ ...current, courseId: event.target.value }))}
            >
              <option value="CS401">CS401</option>
              <option value="CS307">CS307</option>
              <option value="CS205">CS205</option>
            </select>
          </div>
          <InputField
            id="mark-date"
            type="date"
            label="Date"
            value={recordForm.date}
            onChange={(value) => setRecordForm((current) => ({ ...current, date: value }))}
          />
          <InputField
            id="mark-present"
            type="number"
            label="Present"
            value={recordForm.present}
            onChange={(value) => setRecordForm((current) => ({ ...current, present: value }))}
            min="0"
          />
          <InputField
            id="mark-absent"
            type="number"
            label="Absent"
            value={recordForm.absent}
            onChange={(value) => setRecordForm((current) => ({ ...current, absent: value }))}
            min="0"
          />
          <InputField
            id="mark-late"
            type="number"
            label="Late"
            value={recordForm.late}
            onChange={(value) => setRecordForm((current) => ({ ...current, late: value }))}
            min="0"
          />
          <InputField
            id="mark-excused"
            type="number"
            label="Excused"
            value={recordForm.excused}
            onChange={(value) => setRecordForm((current) => ({ ...current, excused: value }))}
            min="0"
          />
        </form>
      </Modal>
    </section>
  );
}
