import LinkedList from "./LinkedList";

export default class GraphVertex {
	constructor(value) {
		if (value === undefined) {
			throw new Error('Graph vertex must have a value');
		}

		const edgeComparator = (edgeA, edgeB) => {
			if (edgeA.getKey() === degeB.getKey()) {
				return 0;
			}

			return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
		};

		this.value = value;
		this.edges = new LinkedList(edgeComparator);
	}

	/**
	 * 顶点新增边
	 * @param {GraphEdge} edge
	 * @returns {GraphVertex}
	*/
	addEdge(edge) {
		this.edges.append(edge);

		return this;
	}

	/**
	 * 删除顶点的某个边
	 * @param {GraphEdge} edge
	*/
	deleteEdge(edge) {
		this.edges.delete(edge);
	}

	/**
	 * 找到顶点想连的其他顶点（邻居）
	 * @returns [GraphVertex[]]
	*/
	getNeighbors() {
		const edges = this.edges.toArray();

		const neighborsConverter = (node) => {
			return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
		};

		return edges.map(neighborsConverter);
	}

	/**
	 * 返回所有的边
	 * @return {GraphEdge[]}
	*/
	getEdges() {
		return this.edges.toArray().map(linkedListNode => linkedListNode.value);
	}

	/**
	 * 返回顶点的度
	 * @return {number}
	*/
	getDegree() {
		return this.edges.toArray().length;
	}

	/**
	 * 一个顶点中，是否含有指定的边
	 * @param {GraphEdge} requiredEdge
	 * @returns {boolean}
	*/
	hasEdge(requiredEdge) {
		const edgeNode = this.edges.find({
			callback: edge => edge === requiredEdge,
		});

		return !!edgeNode;
	}

	/**
	 * 寻找两个顶点之间的边
	 * @param {GraphVertex} vertex
	 * @returns {(GraphEdge|null)}
	*/
	findEdge(vertex) {
		const edgeFinder = (edge) => {
			return edge.startVertex === vertex || edge.endVertex === vertex;
		};

		const edgeNode = this.edges.find({ callback: edgeFinder });

		return edgeNode ? edgeNode.value : null;
	}

	/**
 	 * returns {string}
	*/
	getKey() {
		return this.value;
	}

	/**
	 * 删除顶点所有边，先获取顶点的所有边，然后依次删除
	 * @return {GraphVertex}
	*/
	deleteAllEdges() {
		this.getEdges().forEach(edge => this.deleteEdge(edge));

		return this;
	}
}