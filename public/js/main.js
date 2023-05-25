import { get_cookie } from './util.js'

const svg = document.getElementById('svg')

// Set dimensions
const VIEWSTATE = parseInt(get_cookie('viewstate')) || 640
document.documentElement.style.width = VIEWSTATE + 'px'
document.documentElement.style.height = VIEWSTATE + 'px'
document.body.style.width = VIEWSTATE + 'px'
document.body.style.height = VIEWSTATE + 'px'
svg.setAttribute('width', VIEWSTATE)
svg.setAttribute('height', VIEWSTATE)

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

const OUTER_RING_WIDTH = 40
const RING_RADIUS = (VIEWSTATE - OUTER_RING_WIDTH) / 2


const CPU_MAX_TEMP = 100
const cpu_bar = document.getElementById('cpu_bar')

function update_cpu (temp) {
    cpu_temp.innerText = Math.round(temp)

    const perpi = temp / CPU_MAX_TEMP * Math.PI / 2
    const x = OUTER_RING_WIDTH / 2 + RING_RADIUS * (1 - Math.cos(perpi))

    const y1 = VIEWSTATE / 2 + RING_RADIUS * Math.sin(perpi)
    const y2 = VIEWSTATE / 2 - RING_RADIUS * Math.sin(perpi)

    cpu_bar.setAttribute('d', `M ${x} ${y1} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${x} ${y2}`)
}


const GPU_MAX_TEMP = 100
const gpu_bar = document.getElementById('gpu_bar')

function update_gpu (temp) {
    gpu_temp.innerText = Math.round(temp)

    const perpi = temp / GPU_MAX_TEMP * Math.PI / 2
    const x = VIEWSTATE / 2 + RING_RADIUS * Math.cos(perpi)

    const y1 = VIEWSTATE / 2 + RING_RADIUS * Math.sin(perpi)
    const y2 = VIEWSTATE / 2 - RING_RADIUS * Math.sin(perpi)

    gpu_bar.setAttribute('d', `M ${x} ${y1} A ${RING_RADIUS} ${RING_RADIUS} 0 0 0 ${x} ${y2}`)
}

update_cpu(30)
update_gpu(50)