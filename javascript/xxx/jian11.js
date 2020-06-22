// let arr = [5,6,7,8,9,10,1,1,2,3,4]
// let arr = [7,8,9,10,1,1,1,2,3,4,5,6]
let arr = [2, 2, 2, 0, 1]

function minNum(arr) {
	let start = 0
	let end = arr.length - 1

	while(start < end) {
		let mid = (start + end) / 2
		if (arr[mid] < arr[end]) {
			end = mid
		} else if (arr[mid] > arr[end]) {
			start = mid + 1
		} else {
			return find(arr, start, end)
		}
	}

	console.log(start)
	return arr[start]
}

function find(arr, start, end) {
	let result = arr[start]
	for (let i = start; i <= end; i++) {
		if (arr[i] < result) {
			result = arr[i]
		}
	}

	return result
}

console.log(minNum(arr))