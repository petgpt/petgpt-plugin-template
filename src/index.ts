import { PetExpose, IPetPluginInterface, PluginData } from './lib/types.js'
import { log } from './lib/helper.js'

const pluginName = 'template'
function bindEventListener(ctx: PetExpose) {
    ctx.emitter.on(`plugin.${pluginName}.config.update`, (data: any) => {
        log(`[event] [plugin.${pluginName}.config.update] receive data:`, data)
    })
    ctx.emitter.on(`plugin.${pluginName}.data`, (data: PluginData) => {
        ctx.emitter.emit('upsertLatestText', {
            id: '123',
            type: 'system',
            text: 'Hello'
        })
        setTimeout(() => {
            ctx.emitter.emit('upsertLatestText', {
                id: '123',
                type: 'system',
                text: 'Hello world!'
            })
        }, 1000)
        log(`[event] [plugin.${pluginName}.data] receive data:`, data)
    });
}
export default (ctx: PetExpose): IPetPluginInterface => {
    const register = () => {
        bindEventListener(ctx)
        log(`[register] ctx: ${JSON.stringify(ctx)}`)
    }

    const unregister = () => {
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.data`)
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.config.update`)
        log(`[unregister]`)
    }
    return {
        name: 'test',
        version: '1.0.0',
        description: 'test',
        register,
        unregister,
        config: () => [{
            name: 'testM',
            type: 'input',
            required: true,
        }],
        slotMenu: [],
        handle: (data: PluginData) => new Promise((resolve, _) => {
            ctx.emitter.emit(`plugin.${pluginName}.data`, data) // 转发给自己的listener

            let res = {
                id: '',
                success: true,
                body: `receive data: ${data.data}`
            }
            log(`[handle] plugin receive:${JSON.stringify(data)}, handle res: ${res}`)
            resolve(res)
        }),
        stop: () => new Promise((resolve, _) => {
            log('[stop]')
            resolve()
        }),
    }
}
