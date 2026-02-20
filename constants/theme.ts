// Определяем, какие свойства будут в каждой теме
export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
}

// Светлая тема (вдохновленная GitHub Light)
export const lightTheme: Theme = {
  background: "#f6f8fa", // Светло-серый фон
  card: "#ffffff", // Белые карточки
  text: "#24292e", // Темно-серый текст
  textSecondary: "#586069", // Серый второстепенный текст
  primary: "#0366d6", // Синий для акцентов
  border: "#e1e4e8", // Светло-серый для границ
};

// Темная тема (вдохновленная GitHub Dark)
export const darkTheme: Theme = {
  background: "#0d1117", // Очень темный фон
  card: "#161b22", // Чуть более светлые карточки
  text: "#c9d1d9", // Светло-серый текст
  textSecondary: "#8b949e", // Более темный второстепенный текст
  primary: "#58a6ff", // Светло-синий для акцентов
  border: "#30363d", // Темно-серый для границ
};
