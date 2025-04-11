import { useState } from "react";

import TextLabeling from "./TextLabeling/TextLabeling";
import { TextLabel } from "./TextLabeling/Types";

const text = `Генеральному директору
ООО «Строй-Сервис М»
Иванчукову Д.Т.
крановцика
Ситдикова Л. Я.

Заявление.

Прошу предоставить мне ежегодный оплачиваемый отпуск
с «1» сентября 2016 г. по «28» сентября 2016 г.
сроком на 28 календарных дней.

_________________/Ситдиков Л.Я. /

15 августа 2016 г.
`;

const labels = [
  { color: "#90ee90", label: "ФИО" },
  { color: "#add8e6", label: "Дата" },
  { color: "#f08080", label: "Тип" },
];

function App() {
  const [labeling, setLabeling] = useState<TextLabel[]>([]);

  return (
    <div style={{ height: "100vh" }}>
      <TextLabeling labels={labels} text={text} labeling={labeling} onChange={setLabeling} />
    </div>
  );
}

export default App;
