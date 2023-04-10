import { PetExpose, IPetPluginInterface, PluginData } from './lib/types.js'
import { log } from './lib/helper.js'

function bindEventListener(ctx: PetExpose) { 
    ctx.emitter.on('eventFromElectron', (data: any) => { 
        log(`receive data: ${data}`)
    })
}
export default (ctx: PetExpose): IPetPluginInterface => {
    log(`init, ctx: ${JSON.stringify(ctx)}`)
    bindEventListener(ctx)
    setTimeout(() => ctx.emitter.emit('eventFromPlugin', 'data from plugin!!'), 3000)
    return {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        config: () => [{
            name: 'testM',
            type: 'input',
            required: true,
        }],
        handle: (data: PluginData) => new Promise((resolve, _) => { 
            let res = {
                id: '',
                success: true,
                body: `receive data: ${data.data}`
            }
            log(`plugin receive:${JSON.stringify(data)}, handle res: ${res}`)
            resolve(res)
        }),
        stop: () => new Promise((resolve, _) => { 
            log('stop')
            resolve()
        }),
    }
}
