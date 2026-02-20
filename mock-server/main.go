package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Структура ответа, которую ожидает мобильное приложение
type DiscoveryResponse struct {
	Type string `json:"type"`
	Name string `json:"name"`
}

type Capability struct {
	ID       string `json:"id"`
	Type     string `json:"type"`
	Label    string `json:"label"`
	Endpoint string `json:"endpoint"`
	Value    any    `json:"value,omitempty"`
	Min      *int   `json:"min,omitempty"`
	Max      *int   `json:"max,omitempty"`
}

func discoveryHandler(w http.ResponseWriter, r *http.Request) {
	// Легируем, что нас нашли
	log.Printf("Получен запрос на обнаружение от %s", r.RemoteAddr)

	// Формируем ответ
	response := DiscoveryResponse{
		Type: "NodeControlDevice",     // Это поле должно в точности совпадать с тем, что ищет приложение
		Name: "Go Mock Server (Тест)", // Можете указать любое имя
	}

	// Устанавливаем заголовок, что мы отвечаем JSON'ом
	w.Header().Set("Content-Type", "application/json")
	// Отдаем успешный статус
	w.WriteHeader(http.StatusOK)
	// Кодируем и отправляем наш ответ
	json.NewEncoder(w).Encode(response)
}

func capabilitiesHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Получен запрос возможностей от %s", r.RemoteAddr)
	// Формируем список ручек
	capabilities := []Capability{
		{
			ID:       "main_light",
			Type:     "toggle",
			Label:    "Основной свет",
			Endpoint: "/controls/main_light",
			Value:    true,
		},
		{
			ID:       "night_light",
			Type:     "toggle",
			Label:    "Ночник",
			Endpoint: "/controls/night_light",
			Value:    false,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(capabilities)
}

// mock-server/main.go

type ControlPayload struct {
	Value any `json:"value"`
}

func controlHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не разрешен", http.StatusMethodNotAllowed)
		return
	}
	var payload ControlPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}
	log.Printf("Получена команда для %s: %+v", r.URL.Path, payload)
	w.WriteHeader(http.StatusOK)
}

func main() {
	// Регистрируем наш обработчик для пути /discovery
	http.HandleFunc("/discovery", discoveryHandler)
	// Регистрируем наш обработчик для пути /capabilities
	http.HandleFunc("/capabilities", capabilitiesHandler)

	http.HandleFunc("/controls/", controlHandler)

	// Запускаем сервер на порту 80
	log.Println("Запускаю mock-сервер на порту :80...")
	// Важно: Запуск на порту 80 может потребовать прав администратора (sudo)
	if err := http.ListenAndServe(":80", nil); err != nil {
		log.Fatalf("Не удалось запустить сервер: %s\n", err)
	}
}
