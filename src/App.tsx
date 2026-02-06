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
import Lesson7 from './components/Lesson7'
import Lesson8 from './components/Lesson8'
import Lesson9 from './components/Lesson9'
import Lesson10 from './components/Lesson10'
import Lesson11 from './components/Lesson11'
import Lesson12 from './components/Lesson12'

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
        
          case 'lesson7':
        return <Lesson7 />

        
          case 'lesson8':
        return <Lesson8 />

        case 'lesson9':
        return <Lesson9 />
        case 'lesson10':
        return <Lesson10 />
        case 'lesson11':
        return <Lesson11 />
        case 'lesson12':
        return <Lesson12 />
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
              <option value="lesson7">Lección 7</option>
              <option value="lesson8">Lección 8</option>
                <option value="lesson9">Lección 9</option>
                        <option value="lesson10">Lección 10</option>
                                <option value="lesson11">Lección 11</option>
                                        <option value="lesson12">Lección 12</option>
      
      </select>

      <hr />

      {renderLesson()}
    </div>
  )
}

export default App