import path from "path";

let utils = {
	generateFilePathForEnv: function generateFilePathForEnv(aPath: string) {
		console.log()
		if (process.env.ENV === "prod") return path.join('../' + aPath);
		return path.join('../../' + aPath);
	}
}

export default utils;
export const generateFilePathForEnv = utils.generateFilePathForEnv;

