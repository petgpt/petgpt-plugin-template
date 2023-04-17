import { PetExpose, IPetPluginInterface, PluginData } from './lib/types.js'
import { log } from './lib/helper.js'

const pluginName = 'template'
function bindEventListener(ctx: PetExpose) {
    // 监听配置是否发生变化，如果有变化，通过赋予的db权限，获取新的值
    if(!ctx.emitter.listenerCount(`plugin.${pluginName}.config.update`)) {
        ctx.emitter.on(`plugin.${pluginName}.config.update`, (data: any) => {
            log(`[event] [plugin.${pluginName}.config.update] receive data:`, data)
        })
    }

    if(!ctx.emitter.listenerCount(`plugin.${pluginName}.data`)) {
        // 监听发来的对话信息，调用api，获取回复
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
        })
    }

    if(!ctx.emitter.listenerCount(`plugin.${pluginName}.slot.push`)) {
        // 监听slot里的数据更新事件
        ctx.emitter.on(`plugin.${pluginName}.slot.push`, (newSlotData: any) => {
            log(`[event] [plugin.${pluginName}.slot.push] receive data:`, newSlotData)
        })
    }


    if(!ctx.emitter.listenerCount(`plugin.${pluginName}.func.clear`)) {
        // 监听clear事件
        ctx.emitter.on(`plugin.${pluginName}.func.clear`, () => {
            log(`clear`)
        })
    }
}
export default (ctx: PetExpose): IPetPluginInterface => {
    const register = () => {
        bindEventListener(ctx)
        log(`[register] ctx: ${JSON.stringify(ctx)}`)
    }

    const unregister = () => {
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.config.update`)
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.data`)
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.slot.push`)
        ctx.emitter.removeAllListeners(`plugin.${pluginName}.func.clear`)
        log(`[unregister]`)
    }
    return {
        register,
        unregister,
        config: () => [{
            name: 'testM',
            type: 'input',
            required: true,
        }],
        slotMenu: () => [],
        handle: (data: PluginData) => new Promise(() => {
            ctx.emitter.emit(`plugin.${pluginName}.data`, data) // 转发给自己的listener
            log(`[handle]`)
        }),
        stop: () => new Promise((resolve, _) => {
            log('[stop]')
            resolve()
        }),
    }
}
