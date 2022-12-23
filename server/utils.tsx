import path from "path";

let utils = {
	generateFilePathForEnv: function generateFilePathForEnv(path: string) {
		console.log()
		if (process.env.ENV === "prod") return path;
		return '../../' + path;
	}
}

export default utils;
export const generateFilePathForEnv = utils.generateFilePathForEnv;

