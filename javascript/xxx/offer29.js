let aa = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]
console.log(aa)

let top = 0
let bottom = aa.length - 1
let left = 0
let right = aa[0].length - 1

let arr = []

while(top <= bottom && left <= right) {
	for (let i = left; i <= right; i++) {
		arr.push(aa[top][i])
	}
	top++;
	if (top > bottom) {
		break;
	}

	for (let i = top; i <= bottom; i++) {
		arr.push(aa[i][right])
	}
	right--
	if (left > right) {
		break;
	}

	for (let i = right; i >= left; i --) {
		arr.push(aa[bottom][i])
	}
	bottom--
	if (top > bottom) {
		break;
	}

	for (let i = bottom; i >= top; i--) {
		arr.push(aa[i][left])
	}
	left++
	if (left > right) {
		break;
	}
}

console.log(arr)