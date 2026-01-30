import { useState } from 'react'
import Lesson1 from './components/Lesson1'
import Lesson2 from './components/Lesson2'
import Lesson3 from './components/Lesson3'
import Lesson4a from './components/Lesson4a'
import Lesson4b from './components/Lesson4b'
import Ejercicios1 from './components/Ejercicios1'
import Lesson5 from './components/Lesson5'
import Ejercicio2 from './components/Ejercicio2'
import Lesson6 from './components/Lesson6'

function App() {
  const [lesson, setLesson] = useState('lesson1')

  const renderLesson = () => {
    switch (lesson) {
      case 'lesson1':
        return <Lesson1 />
      case 'lesson2':
        return <Lesson2 />

      case 'lesson3':
        return <Lesson3 />

        case 'lesson4a':
        return <Lesson4a />
case 'lesson4b':
        return <Lesson4b />
         case 'Ejercicios1':
        return <Ejercicios1 />

        case 'lesson5':
        return <Lesson5 />

        case 'Ejercicio2':
        return <Ejercicio2 />


          case 'lesson6':
        return <Lesson6 />
      default:
        return null
    }
  }

  return (
    <div>
      <select value={lesson} onChange={(e) => setLesson(e.target.value)}>
        <option value="lesson1">Lección 1</option>
        <option value="lesson2">Lección 2</option>
        <option value="lesson3">Lección 3</option>
        <option value="lesson4a">Lección 4a</option>
        <option value="lesson4b">Lección 4b</option>
        <option value="Ejercicios1">Ejercicios 1</option>
         <option value="lesson5">Lección 5</option>
         <option value="Ejercicio2">Ejercicio 2</option>
       <option value="lesson6">Lección 6</option>
        
      
      </select>

      <hr />

      {renderLesson()}
    </div>
  )
}

export default App