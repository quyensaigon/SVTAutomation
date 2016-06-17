var moment = require('moment');

module.exports = {

	login: function(mysql, req, res, username, password)
	{
		
		var connection = mysql.createConnection({
			host : 'us-cdbr-iron-east-03.cleardb.net',
			user : 'bb6765b03f6124',
			password : 'cf2ba2f8',
			database : 'ad_fd96d06be4c694a'
		});
		
		connection.connect(function(err){
			if (!err)
			{
				
				console.log("Database is connected");
			}
			else
			{
				console.log("Failed to connect to database");
			}
			
		});
		
		var query = "SELECT * from user WHERE username='"+username+"' AND password='"+password+"'";
		connection.query(query,function(err, rows, fields){
			if (!err)
			{
				
				//console.log(rows);
				json = JSON.stringify(rows);
				res.writeHead(200, {
		            'Content-Type' : 'x-application/json'
		        });
		        console.log('json:', json);
		        res.end(json);
			}
			
		});
		connection.end();
		
	},
	
	loginEx: function(mysql, req, res, username, password)
	{
		
		var callback = function(err, result) {
	        res.writeHead(200, {
	            'Content-Type' : 'x-application/json'
	        });
	        console.log('json:', result);
	        res.end(result);
	    };
	    var query = 'SELECT * from user';
	    getSQL(mysql, query, callback);
	},
	
	get_setup_info: function(mysql,project_id,req,res)
	{
		
		var connection = mysql.createConnection({
			host : 'us-cdbr-iron-east-03.cleardb.net',
			user : 'bb6765b03f6124',
			password : 'cf2ba2f8',
			database : 'ad_fd96d06be4c694a'
		});
		
		connection.connect(function(err){
			if (!err)
			{
				console.log("Database is connected");
			}
			else
			{
				console.log("Failed to connect to database");
			}
			
		});
		
		var query = "SELECT * FROM tbl_setup_info WHERE project_id="+project_id;
		connection.query(query,function(err, rows, fields){
			connection.end({ timeout: 600000 });
			if (!err)
			{
				
				res.write("<b>Setup info: </b><select id=\"lst_setup_info\" name=\"lst_setup_info\" onchange=\"updateView()\">");
				
				result = JSON.stringify(rows);
				
		        if (rows.length > 0)
		        {
		        	for (var i = 0, len = rows.length; i < len; ++i) {
		            	var row = rows[i];
		            	console.log("chan qua" + row);
		            	res.write("<option value='" + row.setup_id + "'>" + row.setup_name + "</option>"); 	
		            }
		         	res.write("</ul>");
		        	res.write( "" + tabStr);
		            //res.write("</div>");
		            
		        }
		        res.write("</select> <br/><br/>");
		        res.end();
			}
			
		});
		
		
	},
	
	get_test_summary: function(mysql,setup_id,req,res)
	{
		
		var connection = mysql.createConnection({
			host : 'us-cdbr-iron-east-03.cleardb.net',
			user : 'bb6765b03f6124',
			password : 'cf2ba2f8',
			database : 'ad_fd96d06be4c694a'
		});
		
		connection.connect(function(err){
			if (!err)
			{
				console.log("Database is connected");
			}
			else
			{
				console.log("Failed to connect to database");
			}
			
		});
		var sql=""+ 
		    "SELECT * FROM ("+
		    "SELECT test_date,count(tc_id) as total,SUM(CASE when result = 'PASSED' then 1 else 0 end ) as passed,SUM(CASE when result = 'FAILED' then 1 else 0 end ) as failed "+
		    "FROM tbl_test_result "+
		    "WHERE test_date IN (select distinct(test_date) FROM tbl_test_result WHERE setup_id="+setup_id+") "+
		    "GROUP BY test_date "+
		    "ORDER BY test_date DESC "+
		    "LIMIT 0, 20) sub ORDER BY test_date ASC";
		    		
		var query = sql;
		connection.query(query,function(err, rows, fields){
			connection.end({ timeout: 600000 });
			if (!err)
			{
				
				res.write( '<b>Test result summary</b>');
				res.write( "<table id=\"summary_table\" class=\"display\" cellspacing=\"0\" width=\"100%\">");
				res.write( "<thead>");
				res.write( "	<tr>");
				res.write( "		<th>Test Date</th>");
				res.write( "		<th>Passed</th>");
				res.write( "		<th>Failed</th>");
				res.write( "		<th>Total</th>");
				res.write( "	</tr>");
				res.write("</thead>");
				if (rows.length > 0)
		        {
		        	for (var i = 0, len = rows.length; i < len; ++i) {
		            	var row = rows[i];
		            	temp = row.test_date;
		            	date_temp = moment(temp).format("YYYY-MM-DD HH:mm:ss");
		            	//tblRow = "<tr><td class='border'><a href='#' onclick=\"return showResultDetails('" + row.test_date + "');\">" + row.test_date + "</a></td>";
		            	tblRow = "<tr><td class='border'><a href='#' onclick=\"return showResultDetails('" + date_temp + "');\">" + date_temp + "</a></td>";
		                tblRow += "<td class='border'>" + row.passed + "</td>";
		                tblRow += "<td class='border'>" + row.failed + "</td>";
		                tblRow += "<td class='border'>" + row.total + "</td></tr>";
		                res.write( tblRow); 	
		            }
		         	res.write('</table>');
		        	//res.write( "" + tabStr);
		            //res.write("</div>");
		            
		        }
		        //res.write("</select> <br/><br/>");
		        res.end();
			}
			
		});
		
		
	},
	
	get_result_details: function(mysql,test_date,req,res)
	{
		
		var jenkins_report_path= "http://158.85.175.84/jenkins_report/FVT_SVT/";
		var connection = mysql.createConnection({
			host : 'us-cdbr-iron-east-03.cleardb.net',
			user : 'bb6765b03f6124',
			password : 'cf2ba2f8',
			database : 'ad_fd96d06be4c694a'
		});
		
		var temp = new Date(test_date);
		date_temp = moment(temp).format("YYYY-MM-DD HH:mm:ss"); 
		
		connection.connect(function(err){
			if (!err)
			{
				console.log("Database is connected");
			}
			else
			{
				console.log("Failed to connect to database");
			}
			
		});
		//res.write(""+date_temp);
		var sql="SELECT * FROM tbl_test_result AS r, tbl_test_case AS tc WHERE r.tc_id = tc.tc_id AND test_date = '"+test_date+"'";
		//var sql="SELECT * FROM tbl_test_result AS r, tbl_test_case AS tc WHERE r.tc_id = tc.tc_id AND test_date = '"+date_temp+"'";
		
		
		var query = sql;
		connection.query(query,function(err, rows, fields){
			connection.end({ timeout: 600000 });
			if (!err)
			{
				//res.write(sql + "" + rows.length);
				res.write( '<b>Test result for ' + test_date + '</b>');
				res.write( "<table class='border'>");
				res.write( '<tr bgcolor="#CCCC99"><th>TC ID</th><th>Description</th><th>Result</th></tr>');
				
				if (rows.length > 0)
		        {
		        	for (var i = 0, len = rows.length; i < len; ++i) {
		            	var row = rows[i];
		            	tblRow = "<tr><td class='border'><a href=\"getResultHistory.php?tc_id=" + row.tc_id + "\" target=\"_blank\">" + row.tc_id + "</td>";
		                tblRow += "<td class='border'>" + row.description + "</td>";
		                if (row.report)
		        			tblRow += "<td class='border'><a href=\"" + jenkins_report_path + row.report + "\" target=\"_blank\">"  + row.result + "</a></td></tr>";
		        		else
		        			tblRow += "<td class='border'><a href=message.php target=\"_blank\">"  + row.result + "</a></td></tr>";
		                
		                res.write( tblRow); 	
		            }
		         	res.write('</table>');
		        	//res.write( "" + tabStr);
		            //res.write("</div>");
		            
		        }
		        //res.write("</select> <br/><br/>");
		        res.end();
			}
			
		});
		
		
	},
	
	showtabs: function(mysql, req, res)
	{
		
		var connection = mysql.createConnection({
			host : 'us-cdbr-iron-east-03.cleardb.net',
			user : 'bb6765b03f6124',
			password : 'cf2ba2f8',
			database : 'ad_fd96d06be4c694a'
		});
		
		connection.connect(function(err){
			if (!err)
			{
				
				console.log("Database is connected");
			}
			else
			{
				console.log("Failed to connect to database");
			}
			
		});
		
		var query = "SELECT * FROM tbl_project";
		connection.query(query,function(err, rows, fields){
			connection.end({ timeout: 600000 });
			if (!err)
			{
				
				//console.log(rows);
				
				result = JSON.stringify(rows);
				//res.writeHead(200, {'Content-Type': 'text/html'});
				/*
				 res.writeHead(200, {
		            'Content-Type' : 'x-application/json'
		        });
		        */
		        //console.log('json:', result);
		        //console.log('chan qua nua', rows.length);
		        //res.write("<html><body> chan qua");
		        if (rows.length > 0)
		        {
		        	
		        	res.write("<div id=\"tabs\">");
		        	//echo "quyen oi";
		            res.write("<ul>");
		        	i = 0;
		            tabStr="";
		            for (var i = 0, len = rows.length; i < len; ++i) {
		            	var row = rows[i];
		            	console.log("chan qua" + row);
		        	//while($row = $result->fetch_assoc()){
		                //echo "quyen a";
		            	res.write("<li><a href=\"#fragment-" + i + "\" onclick=\"tabClick('fragment-"+i+"')\"><span>" + row.project_name + "</span></a></li>");
		        	        
		        		
		        		oneTabStr="<div id=\"fragment-"+i+"\""  + " value=\"" + row.project_id + "\"></div>";
		        		
		        	
		        		tabStr = tabStr + oneTabStr;
		        		//$i = $i + 1; 	
		            	}
		         	res.write("</ul>");
		        	res.write( "" + tabStr);
		            //res.write("</div>");
		            
		        }
		        res.write("</body></html>");
		        res.end();
			}
			
		});
		
		
	}

	

};

function getSQL(mysql, query, callback) {
    //var mysql = require('mysql');
    var connection = mysql.createConnection({
		host : 'us-cdbr-iron-east-03.cleardb.net',
		user : 'bb6765b03f6124',
		password : 'cf2ba2f8',
		database : 'ad_fd96d06be4c694a'
	});

    connection.connect(function(err){
		if (!err)
		{
			
			console.log("Database is connected");
		}
		else
		{
			console.log("Failed to connect to database");
		}
		
	});
    var json = '';
    //var query = 'SELECT * FROM test';
    connection.query(query, function(err, results, fields) {
        if (err)
            return callback(err, null);

        console.log('The query-result is: ', results[0]);

        // wrap result-set as json
        json = JSON.stringify(results);

        /***************
        * Correction 2: Nest the callback correctly!
        ***************/
        connection.end();
        console.log('JSON-result:', json);
        callback(null, json);
    });
};