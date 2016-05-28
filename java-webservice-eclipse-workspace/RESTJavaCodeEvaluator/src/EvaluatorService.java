import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import bsh.EvalError;
import bsh.Interpreter;

 
@Path("/evaluatorservice")
public class EvaluatorService {
//	@GET
//	@Produces("application/json")
//	public String get() {
//		
//		JSONObject json = new JSONObject();
//		
//		json.put("data", "Hello there!");
//		
//		return json.toString();
//		
//	}
 
	@Path("/eval")
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public JSONObject eval(String message) {
		
		System.out.println(message);
		
		String code = (new JSONObject(message)).getString("code");
		JSONObject json = new JSONObject();
		
		Interpreter i = new Interpreter();
		try {
			Object result = i.eval(code);
			json.put("result", result.toString());
		} catch (EvalError e) {
			json.put("exception", e.toString());
			e.printStackTrace();
		}
		
		return json;
		
	}
}