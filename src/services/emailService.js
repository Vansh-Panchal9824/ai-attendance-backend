const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send attendance notification
const sendAttendanceNotification = async (student, classData, status) => {
  try {
    const mailOptions = {
      from: `"AI Attendance System" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `Attendance Notification - ${classData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #10b981); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 30px; color: white;">A</span>
            </div>
            <h2 style="color: #111827; margin: 0;">Attendance Marked</h2>
            <p style="color: #6b7280; margin-top: 8px;">${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="color: #111827; margin: 0 0 12px 0;">Student Information</h3>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Student ID:</strong> ${student.studentId || 'N/A'}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="color: #111827; margin: 0 0 12px 0;">Class Information</h3>
            <p><strong>Class:</strong> ${classData.name}</p>
            <p><strong>Code:</strong> ${classData.code}</p>
            <p><strong>Room:</strong> ${classData.room || 'Online'}</p>
            <p><strong>Time:</strong> ${classData.schedule?.startTime || 'Regular'}</p>
          </div>
          
          <div style="background: ${status === 'present' ? '#dcfce7' : '#fee2e2'}; padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="color: ${status === 'present' ? '#16a34a' : '#dc2626'}; margin: 0;">
              ${status === 'present' ? '✅ Present' : '❌ Absent'}
            </h3>
            ${status === 'present' ? '<p style="color: #16a34a; margin-top: 8px;">You have been marked present for this class.</p>' : '<p style="color: #dc2626; margin-top: 8px;">You were absent for this class. Please contact your teacher.</p>'}
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated message from AI Attendance System.</p>
            <a href="${process.env.FRONTEND_URL}" style="color: #6366f1; text-decoration: none;">Visit Dashboard</a>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${student.email}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Send weekly report
const sendWeeklyReport = async (student, stats) => {
  try {
    const mailOptions = {
      from: `"AI Attendance System" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `Weekly Attendance Report - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Weekly Attendance Report</h2>
          <p>Hello ${student.name},</p>
          <p>Here's your attendance summary for this week:</p>
          <ul>
            <li>Total Classes: ${stats.total}</li>
            <li>Present: ${stats.present}</li>
            <li>Absent: ${stats.absent}</li>
            <li>Attendance Rate: ${stats.percentage}%</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/attendance-records">View Details</a>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendAttendanceNotification, sendWeeklyReport };