export default class GraphEdge {
	/**
	 * @param {}
	*/
	constructor(startVertex, endVertex, weight = 0) {
		this.startVertex = startVertex;
		this.endVertex = endVertex;
		this.weight = weight;
	}

	getKey() {
		const startVertexKey = this.startVertex.getKey();
		const endVertexKey = this.endVertex.getKey();

		return `${startVertexKey}_${endVertexKey}`;
	}

	/**
	 * @return {string}
	*/
	toString() {
		this.getKey();
	}
}