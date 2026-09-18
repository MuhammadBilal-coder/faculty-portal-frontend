export const mockUser = {
  id: 'fac-1001',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  department: 'Computer Science',
  role: 'faculty',
  designation: 'Associate Professor',
  avatar: 'SJ',
  verified: true,
  twoFactorEnabled: true,
  lastActive: '2026-09-18T09:10:00.000Z',
};

export const mockStats = {
  students: 312,
  courses: 8,
  assignments: 23,
  attendanceRate: 92,
  unreadMessages: 7,
  pendingSubmissions: 19,
};

export const mockCourses = [
  {
    id: 'CS401',
    title: 'Advanced Web Engineering',
    code: 'CS-401',
    studentCount: 52,
    status: 'Active',
    semester: 'Fall 2026',
    schedule: 'Mon, Wed 10:30 AM',
    room: 'Lab B-204',
    description:
      'Covers scalable frontend architecture, performance optimization, and enterprise deployment workflows for modern web applications.',
  },
  {
    id: 'CS307',
    title: 'Database Systems',
    code: 'CS-307',
    studentCount: 41,
    status: 'Active',
    semester: 'Fall 2026',
    schedule: 'Tue, Thu 9:00 AM',
    room: 'Room C-109',
    description:
      'Relational design, indexing, transaction management, and distributed storage fundamentals with practical SQL labs.',
  },
  {
    id: 'CS205',
    title: 'Object-Oriented Programming',
    code: 'CS-205',
    studentCount: 68,
    status: 'Active',
    semester: 'Fall 2026',
    schedule: 'Mon, Thu 1:30 PM',
    room: 'Room A-302',
    description:
      'Core OOP principles, design patterns, and testing methodologies through Java and TypeScript assignments.',
  },
  {
    id: 'CS503',
    title: 'Machine Learning Foundations',
    code: 'CS-503',
    studentCount: 34,
    status: 'Draft',
    semester: 'Spring 2027',
    schedule: 'Fri 11:00 AM',
    room: 'Lab D-110',
    description:
      'A graduate-level introduction to supervised and unsupervised learning, evaluation metrics, and ethical model deployment.',
  },
];

export const mockStudents = [
  {
    id: 'ST-22001',
    name: 'Aisha Khan',
    email: 'aisha.khan@students.university.edu',
    department: 'Computer Science',
    batch: '2023',
    status: 'Active',
    gpa: 3.82,
    attendance: 96,
  },
  {
    id: 'ST-22002',
    name: 'Usman Raza',
    email: 'usman.raza@students.university.edu',
    department: 'Software Engineering',
    batch: '2022',
    status: 'On Probation',
    gpa: 2.31,
    attendance: 71,
  },
  {
    id: 'ST-22003',
    name: 'Mariam Iqbal',
    email: 'mariam.iqbal@students.university.edu',
    department: 'Computer Science',
    batch: '2024',
    status: 'Active',
    gpa: 3.67,
    attendance: 88,
  },
  {
    id: 'ST-22004',
    name: 'Hassan Ali',
    email: 'hassan.ali@students.university.edu',
    department: 'Business Administration',
    batch: '2023',
    status: 'Active',
    gpa: 3.22,
    attendance: 84,
  },
  {
    id: 'ST-22005',
    name: 'Fatima Noor',
    email: 'fatima.noor@students.university.edu',
    department: 'Mathematics',
    batch: '2025',
    status: 'Active',
    gpa: 3.92,
    attendance: 98,
  },
  {
    id: 'ST-22006',
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@students.university.edu',
    department: 'Computer Science',
    batch: '2022',
    status: 'Inactive',
    gpa: 2.95,
    attendance: 62,
  },
  {
    id: 'ST-22007',
    name: 'Nimra Javed',
    email: 'nimra.javed@students.university.edu',
    department: 'Electrical Engineering',
    batch: '2024',
    status: 'Active',
    gpa: 3.44,
    attendance: 86,
  },
  {
    id: 'ST-22008',
    name: 'Rahim Siddiqui',
    email: 'rahim.siddiqui@students.university.edu',
    department: 'Computer Science',
    batch: '2023',
    status: 'Active',
    gpa: 3.74,
    attendance: 90,
  },
];

export const mockAttendanceRecords = [
  { id: 1, date: '2026-09-10', courseId: 'CS401', present: 48, absent: 2, late: 2, excused: 0 },
  { id: 2, date: '2026-09-11', courseId: 'CS307', present: 38, absent: 1, late: 2, excused: 0 },
  { id: 3, date: '2026-09-12', courseId: 'CS205', present: 60, absent: 5, late: 3, excused: 0 },
  { id: 4, date: '2026-09-14', courseId: 'CS401', present: 50, absent: 1, late: 1, excused: 0 },
  { id: 5, date: '2026-09-16', courseId: 'CS307', present: 40, absent: 0, late: 1, excused: 0 },
];

export const mockAssignments = [
  {
    id: 'ASG-1001',
    title: 'Frontend Architecture Case Study',
    courseId: 'CS401',
    dueDate: '2026-09-25',
    status: 'Open',
    submissions: 43,
    totalStudents: 52,
    description:
      'Design and document a scalable React architecture for a multi-role university system with routing, caching, and secure auth boundaries.',
  },
  {
    id: 'ASG-1002',
    title: 'SQL Normalization Exercise',
    courseId: 'CS307',
    dueDate: '2026-09-20',
    status: 'Closing Soon',
    submissions: 37,
    totalStudents: 41,
    description:
      'Normalize a messy admissions schema into 3NF and justify indexing choices with performance evidence.',
  },
  {
    id: 'ASG-1003',
    title: 'Design Patterns Mini Project',
    courseId: 'CS205',
    dueDate: '2026-10-02',
    status: 'Draft',
    submissions: 0,
    totalStudents: 68,
    description:
      'Implement Observer, Strategy, and Factory patterns in a classroom management simulator.',
  },
];

export const mockSubmissions = [
  {
    id: 'SUB-5001',
    assignmentId: 'ASG-1001',
    studentName: 'Aisha Khan',
    submittedAt: '2026-09-14T07:21:00.000Z',
    grade: null,
    feedback: '',
    status: 'Pending Review',
  },
  {
    id: 'SUB-5002',
    assignmentId: 'ASG-1001',
    studentName: 'Mariam Iqbal',
    submittedAt: '2026-09-14T10:44:00.000Z',
    grade: 88,
    feedback: 'Strong system decomposition. Improve fallback handling for async routes.',
    status: 'Graded',
  },
  {
    id: 'SUB-5003',
    assignmentId: 'ASG-1002',
    studentName: 'Rahim Siddiqui',
    submittedAt: '2026-09-15T14:05:00.000Z',
    grade: null,
    feedback: '',
    status: 'Pending Review',
  },
  {
    id: 'SUB-5004',
    assignmentId: 'ASG-1002',
    studentName: 'Nimra Javed',
    submittedAt: '2026-09-15T16:19:00.000Z',
    grade: 91,
    feedback: 'Excellent query analysis and practical indexing strategy.',
    status: 'Graded',
  },
];

export const mockMessages = [
  {
    id: 'MSG-9001',
    sender: 'Dean Office',
    subject: 'Faculty Senate Meeting Agenda',
    content:
      'Please review the attached senate agenda before Friday. We will finalize accreditation milestones and curriculum review timelines.',
    timestamp: '2026-09-17T09:00:00.000Z',
    unread: true,
    category: 'Administrative',
  },
  {
    id: 'MSG-9002',
    sender: 'Aisha Khan',
    subject: 'Clarification on Assignment Rubric',
    content:
      'Could you clarify whether we should include a threat model section in the architecture case study submission?',
    timestamp: '2026-09-17T12:45:00.000Z',
    unread: true,
    category: 'Student Query',
  },
  {
    id: 'MSG-9003',
    sender: 'IT Services',
    subject: 'Scheduled LMS Maintenance',
    content:
      'A maintenance window is planned this weekend from 01:00 AM to 04:00 AM. Faculty portal access will remain available.',
    timestamp: '2026-09-16T15:30:00.000Z',
    unread: false,
    category: 'System Notice',
  },
  {
    id: 'MSG-9004',
    sender: 'Hassan Ali',
    subject: 'Attendance Rectification Request',
    content:
      'I was marked absent on Sept 12 due to a medical appointment. I have uploaded documentation through the student portal.',
    timestamp: '2026-09-16T08:20:00.000Z',
    unread: false,
    category: 'Student Query',
  },
];

export const mockNotifications = [
  {
    id: 'NTF-001',
    title: 'Assignment due soon',
    description: 'SQL Normalization Exercise closes in 2 days.',
    timestamp: '2026-09-17T16:10:00.000Z',
    type: 'warning',
    read: false,
  },
  {
    id: 'NTF-002',
    title: 'New student message',
    description: 'Aisha Khan sent a question about rubric details.',
    timestamp: '2026-09-17T12:46:00.000Z',
    type: 'info',
    read: false,
  },
  {
    id: 'NTF-003',
    title: 'Attendance trend improved',
    description: 'Overall attendance improved by 4% this week.',
    timestamp: '2026-09-16T11:40:00.000Z',
    type: 'success',
    read: true,
  },
];

export const mockActivityFeed = [
  {
    id: 'ACT-01',
    title: 'Grade posted for Design Patterns Mini Project',
    detail: 'You graded Nimra Javed with 91/100 and shared feedback.',
    when: '2 hours ago',
    icon: '✅',
  },
  {
    id: 'ACT-02',
    title: 'Attendance marked for Advanced Web Engineering',
    detail: '50 present, 1 absent, 1 late for Sept 14 class.',
    when: '1 day ago',
    icon: '🗓️',
  },
  {
    id: 'ACT-03',
    title: 'New message from Dean Office',
    detail: 'Faculty senate meeting agenda shared for review.',
    when: '1 day ago',
    icon: '📨',
  },
  {
    id: 'ACT-04',
    title: 'Course updated',
    detail: 'Database Systems syllabus has been revised for unit 3.',
    when: '2 days ago',
    icon: '📚',
  },
];
