import { useState, useRef, useEffect } from 'preact/hooks'
import { db } from '../../firebase'
import { set, ref, update } from 'firebase/database'
import { QRCodeCanvas } from 'qrcode.react'

const QrCode = () => {
  const [url, setUrl] = useState('')
  const [date, setDate] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState(false)

  const qrRef = useRef()

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value)
  }

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={date}
      size={256}
      bgColor={'#EBECED'}
      level={'L'}
    />
  )

  if (status) {
    setData(() => url + date)
  }

  if (!status) {
    setDate(() => null)
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

  if (status) {
    updateData(url, data)
  }

  const refreshDate = () => {
    setDate(Date.now().toString())
  }

  useEffect(() => {
    let timer
    if (status) {
      timer = setInterval(refreshDate, 5000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [data])

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
            placeholder="Course Name"
          />
          <button
            type="button"
            disabled={!url}
            onClick={() => {
              setStatus(!status)
              writeData(url, data)
              setData(() => '')
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
