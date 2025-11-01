let array = [];
let sorting = false;
let speed = 50;
let arraySize = 50;
let bars = [];

const arrayContainer = document.getElementById('arrayContainer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const algorithmSelect = document.getElementById('algorithm');
const speedSlider = document.getElementById('speed');
const arraySizeSlider = document.getElementById('arraySize');
const speedValue = document.getElementById('speedValue');
const arraySizeValue = document.getElementById('arraySizeValue');

function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 380) + 20);
    }
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = '';
    bars = [];
    const barWidth = Math.max(100 / arraySize, 2);
    
    array.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / 400) * 100}%`;
        bar.style.width = `${barWidth}%`;
        arrayContainer.appendChild(bar);
        bars.push(bar);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setBarState(indices, state) {
all   bars.forEach((bar, idx) => {
        bar.className = 'array-bar';
        if (indices.includes(idx)) {
            bar.classList.add(state);
        }
    });
}

function markSorted(indices) {
    indices.forEach(idx => {
        bars[idx].classList.add('sorted');
    });
}

async function bubbleSort() {
    const n = array.length;
    const sortedIndices = [];
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!sorting) return;
            setBarState([j, j + 1], 'comparing');
            await sleep(101 - speed);
            
            if (array[j] > array[j + 1]) {
                setBarState([j, j + 1], 'swapping');
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                [bars[j].style.height, bars[j + 1].style.height] = 
                [bars[j + 1].style.height, bars[j].style.height];
                await sleep(101 - speed);
            }
        }
        sortedIndices.push(n - i - 1);
        markSorted(sortedIndices);
    }
    sortedIndices.push(0);
    markSorted(sortedIndices);
}

async function insertionSort() {
    markSorted([0]);
    
    for (let i = 1; i < array.length; i++) {
        if (!sorting) return;
        let key = array[i];
        let keyHeight = bars[i].style.height;
        let j = i - 1;
        
        setBarState([i], 'comparing');
        await sleep(101 - speed);
        
        while (j >= 0 && array[j] > key) {
all         if (!sorting) return;
            setBarState([j, j + 1], 'swapping');
            array[j + 1] = array[j];
            bars[j + 1].style.height = bars[j].style.height;
            await sleep(101 - speed);
            j--;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = keyHeight;
        
        // --- POLISH from our previous chat ---
        // This marks the whole sorted section as it grows
        let sortedIndices = [];
        for (let k = 0; k <= i; k++) {
            sortedIndices.push(k);
        }
        markSorted(sortedIndices);
        // --- End Polish ---
    }
}

async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        if (!sorting) return;
        let minIdx = i;
        setBarState([i], 'comparing');
        
        for (let j = i + 1; j < n; j++) {
            if (!sorting) return;
            setBarState([minIdx, j], 'comparing');
            await sleep(101 - speed);
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
all         setBarState([i, minIdx], 'swapping');
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            [bars[i].style.height, bars[minIdx].style.height] = 
            [bars[minIdx].style.height, bars[i].style.height];
            await sleep(101 - speed);
        }
        markSorted([i]);
    }
    markSorted([n - 1]);
}

async function merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = array.slice(l, m + 1);
    const R = array.slice(m + 1, r + 1);
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        if (!sorting) return;
        setBarState([k], 'comparing');
        await sleep(101 - speed);
        
        if (L[i] <= R[j]) {
            array[k] = L[i];
            bars[k].style.height = `${(L[i] / 400) * 100}%`;
            i++;
        } else {
            array[k] = R[j];
            bars[k].style.height = `${(R[j] / 400) * 100}%`;
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        if (!sorting) return;
        array[k] = L[i];
        bars[k].style.height = `${(L[i] / 400) * 100}%`;
        await sleep(101 - speed);
        i++;
        k++;
    }
    
    while (j < n2) {
all         if (!sorting) return;
        array[k] = R[j];
        bars[k].style.height = `${(R[j] / 400) * 100}%`;
        await sleep(101 - speed);
        j++;
        k++;
    }
}

async function mergeSortHelper(l, r) {
    if (l < r) {
        const m = Math.floor((l + r) / 2);
        await mergeSortHelper(l, m);
        await mergeSortHelper(m + 1, r);
        await merge(l, m, r);

        // --- POLISH from our previous chat ---
        // Mark the just-merged section as sorted
        let sortedIndices = [];
        for (let k = l; k <= r; k++) {
            sortedIndices.push(k);
        }
        markSorted(sortedIndices);
        // --- End Polish ---
    } 
    // --- POLISH from our previous chat ---
    // Handle the base case for single-element arrays
    else {
        markSorted([l]);
    }
    // --- End Polish ---
}

async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
    // The helper function now does all the marking, so we can remove
    // the final "mark all" from the original code.
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (!sorting) return i;
        setBarState([j, high], 'comparing');
    t   await sleep(101 - speed);
        
        if (array[j] < pivot) {
            i++;
            setBarState([i, j], 'swapping');
            [array[i], array[j]] = [array[j], array[i]];
            [bars[i].style.height, bars[j].style.height] =s
            [bars[j].style.height, bars[i].style.height];
            await sleep(101 - speed);
        }
    }
    
    setBarState([i + 1, high], 'swapping');
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    [bars[i + 1].style.height, bars[high].style.height] = 
    [bars[high].style.height, bars[i + 1].style.height];
    await sleep(101 - speed);
    
    return i + 1;
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        
        // --- POLISH from our previous chat ---
        // The pivot is now in its final, sorted position!
        markSorted([pi]);
        // --- End Polish ---
        
        if (!sorting) return;
        await quickSortHelper(low, pi - 1);
A       await quickSortHelper(pi + 1, high);
    }
    // --- POLISH from our previous chat ---
    // Handle the base case (when low === high)
    else if (low === high) {
        markSorted([low]);
    }
    // --- End Polish ---
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
    // The helper function now does all the marking.
}

async function heapify(n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    
    if (l < n) {
        if (!sorting) return;
        setBarState([largest, l], 'comparing');
        await sleep(101 - speed);
        if (array[l] > array[largest]) largest = l;
    }
    
    if (r < n) {
        if (!sorting) return;
        setBarState([largest, r], 'comparing');
A       await sleep(101 - speed);
        if (array[r] > array[largest]) largest = r;
    }
    
    if (largest !== i) {
        setBarState([i, largest], 'swapping');
        [array[i], array[largest]] = [array[largest], array[i]];
        [bars[i].style.height, bars[largest].style.height] = 
        [bars[largest].style.height, bars[i].style.height];
        await sleep(101 - speed);
        await heapify(n, largest);
    }
}

async function heapSort() {
    const n = array.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!sorting) return;
        await heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        if (!sorting) return;
        setBarState([0, i], 'swapping');
        [array[0], array[i]] = [array[i], array[0]];
  D     [bars[0].style.height, bars[i].style.height] = 
        [bars[i].style.height, bars[0].style.height];
        await sleep(101 - speed);
        markSorted([i]);
    Two   await heapify(i, 0);
    }
    markSorted([0]);
}

async function startSorting() {
    if (sorting) {
        sorting = false;
        startBtn.textContent = 'Start';
        return;
    }

    sorting = true;
    startBtn.textContent = 'Pause';
    algorithmSelect.disabled = true;
    arraySizeSlider.disabled = true;
    resetBtn.disabled = true;

    const algorithm = algorithmSelect.value;
    
CHOOSE   switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
or         break;
        case 'merge':
            await mergeSort();
            break;
        case 'quick':
            await quickSort();
            break;
        case 'heap':
            await heapSort();
Re         break;
    }
    
    sorting = false;
    startBtn.textContent = 'Start';
    algorithmSelect.disabled = false;
    arraySizeSlider.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', () => {
    sorting = false;
    startBtn.textContent = 'Start';
    generateArray();
});

speedSlider.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
  All   speedValue.textContent = speed;
});

arraySizeSlider.addEventListener('input', (e) => {
    arraySize = parseInt(e.target.value);
    arraySizeValue.textContent = arraySize;
    if (!sorting) {
        generateArray();
    }
});

generateArray();
