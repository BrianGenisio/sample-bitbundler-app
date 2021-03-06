import {action, observable} from 'mobx';

import {dataClient} from '../data-client.js';
import appState from '../state/app-state';

const fetchHooks = action(() => {
    const query = `query {
        hookHandlers {
            id, name
        }
    }`;

    dataClient.query(query).then(response => {
        action(() => {
            response.hookHandlers.forEach(hook => appState.hooks.push(observable(hook)));
        })();
    });
});

const createHook = action(name => {
    const mutation = `($name: String) {
        newHook: createHookHandler(name: $name) {
            id, name
        }
    }`;

    dataClient.mutate(mutation, {name}).then(response => {
        action(() => {
            appState.hooks.push(observable(response.newHook));
        })();
    });
});

const deleteHook = action(id => {
    const mutation = `($id: String) {
        success: deleteHookHandler(id: $id)
    }`;

    dataClient.mutate(mutation, {id}).then(response => {
        action(() => {
            if(response.success) {
                const mutationToRemove = appState.hooks.find(hook => hook.id === id);
                if(mutationToRemove) {
                    appState.hooks.remove(mutationToRemove);
                }
            }
        })();
    });
});

export {
    fetchHooks,
    createHook,
    deleteHook
};
