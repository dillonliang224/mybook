// 单向链表节点
export default class LinkedListNode {
	constructor(value, next = null) {
		// 当前节点的值
		this.value = value;
		// 链表指向的下一节点
		this.next = next;
	}

	toString(callback) {
		return callback ? callback(this.value) : `${this.value}`;
	}
}