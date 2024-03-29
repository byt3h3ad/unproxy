import { useState, useRef, useEffect } from 'preact/hooks'
import { db } from '../../firebase'
import { set, ref, update } from 'firebase/database'
import { QRCodeCanvas } from 'qrcode.react'

const QrCode = () => {
  const [url, setUrl] = useState('')
  const [date, setDate] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState(false)

  const qrRef = useRef()

  if (status) {
    setValue(() => url + date)
  }

  const writeData = (url, value) => {
    if (status) {
      set(ref(db, `/${url}`), {
        value
      })
    } else {
      // pass
    }
  }

  const updateData = (url, value) => {
    update(ref(db, `/${url}`), {
      value
    })
  }

  const refreshDate = () => {
    setDate(Date.now().toString())
    if (status) {
      // console.log(status)
      updateData(url, value)
    }
  }

  useEffect(() => {
    const timer = setInterval(refreshDate, 10000)
    return () => {
      clearInterval(timer)
    }
  }, [value])

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value)
  }

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={value}
      size={256}
      bgColor={'#EBECED'}
      level={'L'}
    />
  )

  return (
    <div className="qrcode__container">
      <div ref={qrRef}>{qrcode}</div>
      <div className="input__group">
        <form method='POST'>
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
              writeData(url, value)
              setValue(() => '')
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
