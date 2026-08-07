import React, { useState, useEffect } from "react";

const DiscountForm = () => {
  const initialTime = 24 * 60 * 60; // 24 часа в секундах

  // Функция для получения оставшегося времени из localStorage или установки нового таймера
  const getStoredTime = () => {
    const storedTime = localStorage.getItem("discount-timer");
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (storedTime) {
      const elapsedTime = currentTime - parseInt(storedTime, 10);
      if (elapsedTime >= initialTime) {
        localStorage.setItem("discount-timer", currentTime);
        return initialTime;
      } else {
        return initialTime - elapsedTime;
      }
    } else {
      localStorage.setItem("discount-timer", currentTime);
      return initialTime;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getStoredTime());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreement: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.setItem("discount-timer", Math.floor(Date.now() / 1000));
          return initialTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Функция для форматирования таймера в формат ЧЧ:ММ:СС
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Обработчик изменений в форме
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      setMessage("Вы должны согласиться с условиями перед отправкой!");
      return;
    }
    console.log("Форма отправлена:", formData);
    setMessage("Заявка успешно отправлена!");
    setTimeout(() => setMessage(""), 3000);
    setFormData({ name: "", email: "", phone: "", agreement: false });
  };

  return (
    <section className="form">
    <div id="contact-form" className="discount-form">
      <h2 className="discount-form__title">Начните учиться со скидкой</h2>
      <div className="discount-form__percent">50%</div>

      <div className="discount-form__timer">
        <span>До конца действия скидки</span>
        <span className="discount-form__timer-value">{formatTime(timeLeft)}</span>
      </div>

      <div className="discount-form__price-section">
        <div className="discount-form__price discount-form__old-price">
          <s>100 000₸</s>
          <p>50 000₸</p>
          <p>в месяц</p>
        </div>
        <div className="discount-form__price discount-form__new-price">
          <s>500 000₸</s>
          <p>250 000₸</p>
          <p>одним платежом</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="discount-form__form">
        <input
          type="text"
          name="name"
          placeholder="Имя Фамилия"
          value={formData.name}
          onChange={handleChange}
          required
          className="discount-form__input"
        />
        <input
          type="email"
          name="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
          required
          className="discount-form__input"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          required
          className="discount-form__input"
        />
        <label className="discount-form__checkbox-container">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
            required
            className="discount-form__checkbox"
          />
          <span className="discount-form__checkmark"></span>
          Я даю согласие на{" "}
          <a href="#" className="discount-form__link">обработку персональных данных</a>, согласен с условиями{" "}
          <a href="#" className="discount-form__link">Пользовательского соглашения и договора оферты</a>
        </label>
        <button type="submit" className="discount-form__button">Оставить заявку</button>
      </form>

      {message && <p className="discount-form__message">{message}</p>}
    </div>
    </section>
  );
};

export default DiscountForm;
