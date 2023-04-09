/* eslint-disable */
import { useState, useRef, useEffect } from 'preact/hooks'
import { db } from '../../firebase'
import { set, ref, update } from 'firebase/database'
import { QRCodeCanvas } from 'qrcode.react'

const QrCode = () => {
  const [url, setUrl] = useState('')
  const [date, setDate] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState(false)

  if (status) {
    setData(() => url + date)
  }

  const writeData = (url, value) => {
    if (status) {
      set(ref(db, `/${url}`), {
        value
      })
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
    setDate(() => Date.now().toString())
  }

  useEffect(() => {
    let timer
    if (status) {
      timer = setInterval(refreshDate, 7000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [data])

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

  return (
    <div className="qrcode__container">
      <div ref={qrRef}>{qrcode}</div>
      {data}
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
              setDate(() => '')
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
