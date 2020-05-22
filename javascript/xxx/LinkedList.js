import LinkedListNode from "./LinkedListNode";

export default class LinkedList {
	/**
	 * @param {Function} [comparatorFunction]
	*/
	constructor(comparatorFunction) {
		/** @var LinkedListNode */
		this.head = null;

		/** @var LinkedListNode */
		this.tail = null;

		this.len = 0;

		this.compare = comparatorFunction;
	}

	addHead(value) {
		// 添加到头部，即原头节点作为新节点的下一节点
		const newNode = new LinkedListNode(value, this.head);
		// 头节点指向新节点
		this.head = newNode;

		// 如果尾节点不存在，那么链表尾节点为新节点
		if (!this.tail) {
			this.tail = newNode;
		}

		this.len++;
		return this;
	}

	addTail(value) {
		const newNode = new LinkedListNode(value, null)

		// 如果头节点不存在，那么新节点既是头节点，也是尾节点
		if (!this.head) {
			this.head = newNode;
			this.tail = newNode;
			this.len++;
			return
		}

		// 原尾节点的下一个指针是新节点
		// 新尾节点是新节点
		this.tail.next = newNode;
		this.tail = newNode;
		this.len++;
		return this;
	}

	deleteHead() {
		if (!this.head) {
			return null;
		}

		const deletedHead = this.head;
		if (this.head.next) {
			this.head = this.head.next;
		} else {
			this.head = null;
			this.tail = null;
		}

		this.len--;
		reutrn deletedHead;
	}

	deleteTail() {
		const deletedTail = this.tail;

		if (this.head === this.tail) {
			this.head = null;
			this.tail = null;
			this.len = 0;

			return deleteTail;
		}

		// 迭代找尾节点的前一个
		let currentNode = this.head;
		while(currentNode.next) {
			if (!currentNode.next.next) {
				// 把倒数第二个节点设置为尾节点, 那么此节点的next为null
				currentNode.next = null;
			} else {
				// 获取下一个节点
				currentNode = currentNode.next;
			}
		}

		// 设置尾节点
		this.tail = currentNode;
		return deletedTail;
	}

	find(value) {
		if (!this.head) {
			return null;
		}

		let currentNode = this.head
		while(currentNode) {
			// 如果查找的值和链表某一节点的值相等，则返回此节点，否则遍历下一节点
			if (value !== undefined && value === currentNode.value) {
				return currentNode;
			}

			currentNode = currentNode.next;
		}
	}

	delete(value) {
		if (!this.head) {
			return null;
		}

		let deletedNode = null;
		// 如果头节点的值和待删除的值相等，取下一个节点作为头节点
		while(this.head && this.head.value === value) {
			deletedNode = this.head;
			this.head = this.head.next;
		}

		let currentNode = this.head;
		if (currentNode !== null) {
			while(currentNode.next) {
				if (currentNode.next.value === value) {
					deletedNode = currentNode.next;
					currentNode.next = currentNode.next.next;
				} else {
					currentNode = currentNode.next;
				}
			}
		}

		// 如果尾节点的值和value相等，那么尾节点也要被删除
		// 新的尾节点就是刚遍历的currentNode，它的next为null，应为新的尾节点
		if (this.tail.value === value) {
			this.tail = currentNode;
		}

		return deletedNode;
	}

	fromArray(values) {
		values.forEach(value => this.addTail(value));

		return this;
	}

	toArray() {
		const nodes = [];

		let currentNode = this.head;
		while(currentNode) {
			nodes.push(currentNode);
			currentNode = currentNode.next;
		}

		return nodes;
	}

	toString() {
		return this.toArray().map(node => node.toString());
	}

	reverse() {
		let currentNode = this.head;
		let preNode = null;
		let nextNode = null;

		while(currentNode) {
			nextNode = currentNode.next;

			currentNode.next = preNode;


			preNode = currentNode;
			currentNode = nextNode;
		}

		this.tail = this.head;
		this.head = preNode;

		return this;
	}
}