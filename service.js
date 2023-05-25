import { Service } from 'node-windows'

const svc = new Service({
    name: 'NZXT pump interface',
    description: 'A web server for the pump interface of NZXT Kraken',
    script: './index.js'
})

svc.on('install', () => {
    svc.start()
})

svc.install()