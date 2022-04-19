export function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}



export function modifyEntry(curId, index, spec, str) {
    let storage = window.localStorage;
    storage['curId'] = curId;
    if (! storage['indices']) {
        storage['indices'] = '';
    }
    let indices = storage['indices'].split(',');
    if (!indices.includes(index.toString())){
        storage['indices'] = (storage['indices'] != '')?storage['indices'] + ',' + index.toString(): index.toString();
    }
    storage[index.toString()+'spec'] = spec;
    storage[index.toString()+'str'] = str;
}

export function removeEntry(curId, index) {
    let storage = window.localStorage;
    storage['curId'] = curId;
    let indices = storage['indices'].split(',');
    let i = 0;
    while (i < indices.length) {
        if (indices[i] == index.toString()){
            indices.splice(i, 1);
        }
        i++;
    }
    storage['indices'] = indices.join(',');
    storage.removeItem(index.toString()+'spec');
    storage.removeItem(index.toString()+'str');
}

export function saveProjects(projSpec, projStr) {
    let storage = window.localStorage;
    storage['projSpec'] = projSpec;
    storage['projStr'] = projStr;
}

export function storageRemoveProject(proj) {
    let storage = window.localStorage;
    let projSpec = storage['projSpec'];
    let projStr = storage['projStr'];
    if (!projSpec) return;
    let projects = [];
    let newSpec = [];
    let spec = projSpec.split(',');
    let startIndex = 0;
    for (let s of spec) {
        let len = parseInt(s);
        let p = projStr.substring(startIndex, startIndex+len);
        startIndex += len;
        if (p != proj) {
            projects.push(p);
            newSpec.push(p.length.toString());
        }
    }
    saveProjects(newSpec.join(','), projects.join(''));
}


export function loadEntries() {
    let storage = window.localStorage;
    let curId = storage['curId'];
    let specs = [];
    let strs = [];
    let indices = storage['indices'];
    if (indices) {
        indices = indices.split(',');
        for (let index of indices) {
            specs.push(storage[index+'spec']);
            strs.push(storage[index+'str']);
        }
    }

    let projSpec = storage['projSpec'];
    if (!projSpec) projSpec = '';
    let projStr = storage['projStr'];
    if (!projStr) projStr = '';

    return [curId, indices, specs, strs, projSpec, projStr];
}

export function integrityTest() {
    // test the integrity of projects
    let storage = window.localStorage;
    let projSpec = storage['projSpec'];
    if (!projSpec) projSpec = '';
    let projStr = storage['projStr'];
    if (!projStr) projStr = '';

    if (projSpec == '' && projStr != ''){
        return 'Error in Projects';
    }

    if (projSpec != '') {
        projSpec = projSpec.split(',');
        let totalLen = projSpec.reduce((partial, a) => partial+parseInt(a), 0);
        if (totalLen == NaN || totalLen != projStr.length) return 'Error in Projects';
    }

    // test the integrity of each todo item
    let indices = storage['indices'];
    if (indices) {
        indices = indices.split(',');
        for (let index of indices) {
            let spec = storage[index+'spec'];
            let str = storage[index+'str'];
            if (!spec || !str) {
                return `Error in Item of index ${index}!`;
            }
            let passed = spec.split(',').reduce((partial, a) => partial+parseInt(a), 0) == str.length;
            if (!passed) {
                return `Error in Item of index ${index}!`;
            }
        }
    }
    return 'Successfully Passed Integrity Test!';    
}