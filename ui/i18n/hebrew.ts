

/* eslint-disable quotes */
export default {
  buttons: {
    add_system: "הוספת מערכת",
    close: "סגירה",
    disconnect: "ניתוק",
    enter_system: "כניסה למערכת",
    revoke_admin: "ביטול הרשאת מנהל",
    make_admin: "הענקת הרשאת מנהל",
    login: "התחברות",
    register: "הרשמה",
    connect_shraga: "התחברות דרך שרגא",
  },
  toast_messages: {
    system_name_required: "יש להזין שם למערכת",
    system_added_success: "המערכת נוספה בהצלחה",
    error_adding_system: "אירעה שגיאה בעת הוספת המערכת",
    error_fetching_systems: "אירעה שגיאה בעת שליפת המערכות",
    not_authorized: "אין לך הרשאות לביצוע פעולה זו",
    system_status_updated: "סטטוס המערכת עודכן בהצלחה",
    failed_fetch_users: "אירעה שגיאה בעת שליפת המשתמשים",
    user_status_updated: "סטטוס המשתמש עודכן בהצלחה",
    failed_update_user_status: "אירעה שגיאה בעדכון סטטוס המשתמש",
    failed_fetch_user_details: "אירעה שגיאה בעת שליפת פרטי המשתמש",
    registration_failed: "הרשמה נכשלה",
    user_registered: "המשתמש נרשם בהצלחה",
    login_failed: "ההתחברות נכשלה",
    user_already_exists: "המשתמש כבר קיים במערכת",
    error_generic: "שגיאה כללית",
    invalid_token: "טוקן לא תקין",
    no_token_found: "לא נמצא טוקן",
    user_data_missing: "מידע המשתמש חסר",
    error_updating_system_status: "אירעה שגיאה בעדכון סטטוס המערכת",
  },
  headings: {
    home: "עמוד הבית",
    welcome: "ברוך הבא",
    welcome_to_system: "ברוך הבא למערכת",
    register: "הרשמה",
    login: "התחברות",
  },
  user_info: {
    welcome_user: "שלום, {{username}}!",
    role: "תפקיד: {{role}}",
    status: "סטטוס: {{status}}",
    status_admin: "מנהל מערכת",
    status_user: "משתמש רגיל",
  },
  notifications: {
    transferring_login: "מועבר לעמוד ההתחברות...",
  },
  labels: {
    first_name: "שם פרטי",
    last_name: "שם משפחה",
    username: "שם משתמש",
    password: "סיסמה",
  },
} as const;
