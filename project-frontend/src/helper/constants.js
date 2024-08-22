export const roles = {
  superAdmin: "superadmin",
  zoneAdmin: "zoneadmin",
  securityOfficer: "securityofficer",
  dutyOfficer: "dutyofficer",
  enterpriseAdmin: "enterpriseadmin",
  factoryOfficial: "factoryofficial",
  constructionAdmin: "constructionadmin",
  visitor: "visitor",
};

export const formatRole = (db_role) =>
  db_role.toLowerCase().split(" ").join("");

export const siteTitle = "The Collectors";
export const adminTitle = "Collectors Admin";

export const siteTheme = {
  darkMode: "darkMode",
};

export function customScrollbar(isDarkMode) {
  return {
    // height: '85vh',
    overflowY: 'auto',
    pr: 2,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: isDarkMode ? '#333' : '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: isDarkMode ? '#888' : '#888',
      borderRadius: '10px',
      '&:hover': {
        backgroundColor: isDarkMode ? '#555' : '#555',
      },
    },
    scrollbarColor: isDarkMode ? '#888 #333' : '#888 #f1f1f1',
    scrollbarWidth: 'thin',
  }
}

export const mysqlDataTypes = [
  { label: "Number", value: "INT" },                            // 0
  { label: "Decimal Number", value: "FLOAT" },                  // 1
  { label: "Text", value: "VARCHAR" },                          // 2
  { label: "Long Text", value: "TEXT" },                        // 3
  { label: "Date", value: "DATE" },                             // 4
  { label: "Time", value: "TIME" },                             // 5
  { label: "Date & Time", value: "DATETIME" },                  // 6
  { label: "True/False (Checkbox)", value: "BOOLEAN" },         // 7
];

export const formats = {
  'DATE': 'DD-MM-YYYY',
  'TIME': 'HH:mm:ss',
  'DATETIME': 'DD-MM-YYYY HH:mm:ss',
};

export const dateFormat = 'DD-MM-YYYY';

export const timeFormat = 'HH:mm:ss';

export const dateTimeFormat = 'DD-MM-YYYY HH:mm:ss';

export function isDateType(type) {
  return mysqlDataTypes[4].value === type || mysqlDataTypes[5].value === type || mysqlDataTypes[6].value === type;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatDateTime(date) {
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(date);
  return `${formattedDate}T${formattedTime}Z`;
}

export function customFieldOnChange(newValue, type) {
  switch (type) {
    case mysqlDataTypes[0].value:
    case mysqlDataTypes[1].value:
    case mysqlDataTypes[2].value:
    case mysqlDataTypes[3].value:
    case mysqlDataTypes[4].value:
    case mysqlDataTypes[5].value:
    case mysqlDataTypes[6].value:
    case mysqlDataTypes[7].value:
      return newValue;
    default:
      return newValue.target.value;
  }
}

export const defaultCategory = { id: -1, label: 'Select One' };
