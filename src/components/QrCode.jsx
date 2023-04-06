import { useState, useRef, useEffect } from 'preact/hooks'
import { db } from '../../firebase-config'
import { set, ref } from 'firebase/database'
import { QRCodeCanvas } from 'qrcode.react'

const QrCode = () => {
  const [url, setUrl] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState(false)

  // console.log(status)
  // console.log(date)
  const qrRef = useRef()

  function writeData (url, value) {
    set(ref(db, 'Course'))
  }

  const refreshDate = () => {
    setDate(Date.now().toString())
  }

  if (status) {
    useEffect(() => {
      const timer = setInterval(refreshDate, 4000)
      return () => {
        clearInterval(timer)
      }
    }, [])
  } else {
    setDate('')
  }

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value)
  }

  const value = url + date

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={value}
      size={256}
      bgColor={'#EBECED'}
      level={'L'}
      imageSettings={{
        src: 'https://i.imgur.com/Q7N9UFs.png',
        x: undefined,
        y: undefined,
        height: 48,
        width: 48,
        excavate: true
      }}
    />
  )

  console.log(value)

  return (
    <div className="qrcode__container">
      <div ref={qrRef}>{qrcode}</div>
      <div className="input__group">
        <form>
          <label>Enter course name please.</label>
          <input
            type="text"
            value={url}
            onChange={qrCodeEncoder}
            placeholder="CourseName"
          />
          <button
            type="button"
            disabled={!url}
            onClick={() => {
              setStatus(!status)
            }}
          >
            {status ? 'Stop \u2000attendance' : 'Start attendance'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default QrCode
