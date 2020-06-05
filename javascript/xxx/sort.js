let arr = [0, 49, 38, 65, 97, 76, 13, 27, 49]

// arr[0] 哨兵

for (let i = 2; i < arr.length; ++i) {
	if (arr[i - 1] > arr[i]) {
		arr[0] = arr[i]
		arr[i] = arr[i -1]

		let j = i - 2
		for (; arr[j] > arr[0] ; --j) {
			arr[j + 1] = arr[j]
		}
		arr[j + 1] = arr[0]
	}
}
arr.shift()
console.log(arr)