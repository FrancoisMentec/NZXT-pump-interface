import { DAYS, MONTHS, get_cookie, th } from './util.js'

const VIEWSTATE = parseInt(get_cookie('viewstate')) || 640
const RING_BORDER = 40
const RING_RADIUS = (VIEWSTATE - RING_BORDER) / 2

const CPU_MAX_TEMP = 100
const GPU_MAX_TEMP = 100

const svg = document.getElementById('svg')
const cpu_bar = document.getElementById('cpu_bar')
const gpu_bar = document.getElementById('gpu_bar')
const date_div = document.getElementById('date')

// Set dimensions
document.documentElement.style.width = VIEWSTATE + 'px'
document.documentElement.style.height = VIEWSTATE + 'px'
document.body.style.width = VIEWSTATE + 'px'
document.body.style.height = VIEWSTATE + 'px'
svg.setAttribute('width', VIEWSTATE)
svg.setAttribute('height', VIEWSTATE)

// Set up text paths
{
    const TEXT_HEIGHT = 50 
    const center = VIEWSTATE / 2
    const p1 = RING_BORDER / 2 + TEXT_HEIGHT
    const p2 = VIEWSTATE - RING_BORDER / 2 - TEXT_HEIGHT
    const RADIUS = RING_RADIUS - TEXT_HEIGHT
    document.getElementById('cpu_label_path').setAttribute('d', `M ${center} ${p2} A ${RADIUS} ${RADIUS} 0 0 1 ${center} ${p1}`)
    document.getElementById('gpu_label_path').setAttribute('d', `M ${center} ${p1} A ${RADIUS} ${RADIUS} 0 0 1 ${center} ${p2}`)
    document.getElementById('date_path').setAttribute('d', `M ${p1} ${center} A ${RADIUS} ${RADIUS} 0 0 0 ${p2} ${center}`)
}

const cpu_temp = document.getElementById('cpu_temp')
const gpu_temp = document.getElementById('gpu_temp')
window.nzxt = {
    v1: {
        onMonitoringDataUpdate: (data) => {
            const { cpus, gpus, ram } = data // https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
            update_cpu(cpus[0].temperature)
            update_gpu(gpus[0].temperature)
        }
    }
}

function update_cpu (temp) {
    cpu_temp.innerText = Math.round(temp)// + '°'

    const perpi = temp / CPU_MAX_TEMP * Math.PI / 2
    const x = RING_BORDER / 2 + RING_RADIUS * (1 - Math.cos(perpi))
    const y1 = VIEWSTATE / 2 + RING_RADIUS * Math.sin(perpi)
    const y2 = VIEWSTATE / 2 - RING_RADIUS * Math.sin(perpi)
    cpu_bar.setAttribute('d', `M ${x} ${y1} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${x} ${y2}`)
}

function update_gpu (temp) {
    gpu_temp.innerText = Math.round(temp)// + '°'

    const perpi = temp / GPU_MAX_TEMP * Math.PI / 2
    const x = VIEWSTATE / 2 + RING_RADIUS * Math.cos(perpi)
    const y1 = VIEWSTATE / 2 + RING_RADIUS * Math.sin(perpi)
    const y2 = VIEWSTATE / 2 - RING_RADIUS * Math.sin(perpi)
    gpu_bar.setAttribute('d', `M ${x} ${y1} A ${RING_RADIUS} ${RING_RADIUS} 0 0 0 ${x} ${y2}`)
}

/*update_cpu(30)
update_gpu(50)*/

function update_date () {
    const now = new Date()
    date_div.innerHTML = `${now.getDate()} ${MONTHS[now.getMonth()]}` // ${now.getFullYear()}`
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)
    setTimeout(update_date, tomorrow - now)
}

update_date()
