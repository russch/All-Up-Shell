//---Globals
var mainWorkbookUrl = "https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/SalesDashboard";
var mainVizDiv, mainViz, whichViz="None";
var alertOutput; // used to hold outlier marks selected by user

function initialize(){
   
    // Viz div
    mainVizDiv = $('#thecentercolumn');
    initButtons();

    
    //Menu selection    
    $( "#menu" ).menu({ select: function( event, ui ) 
        {
            menuSelection = ui.item.text();
            switch (menuSelection){
                case "My Profile":
                    disposeViz();
                    mainVizDiv.append("<img id='profile' src='images/Profile.jpg' alt='Stylin and Profilin' align='middle'/>");        
                    break;
                case "Messages":
                    disposeViz();
                    mainVizDiv.append("<img id='profile' src='images/messages.png' alt='Stylin and Profilin' align='middle'/>");        
                    break;
                case "Sales Report":  
                    whichViz = "Sales"; // Track which viz is being displayed...
                    renderViz('https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/SalesDashboard');       
                    break;
                case "Activity Report":
                    whichViz = "Activity"; // Track which viz is being displayed...
                    renderViz('https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/ActivityDashboard');
                    //Add Slider
                    initSlider();
                    break;
                case "Shipping / CSAT":
                    $("#csButton").removeAttr('disabled');
                    whichViz = "Shipping"; // Track which viz is being displayed...
                    renderViz('https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/ShippingPerformanceDashboard');
                    
                    // Add Selection Buttons


                    break;
                case "Another Item":

                    break;
                }
    
        }
    });
    
    // Add click events to each button image
    $("#warfare").click(filterWarfare);
    $("#sports").click(filterSports);
    $("#cardgames").click(filterCardGames);
    $("#swords").click(filterSwords);
    $("#strategygames").click(filterStrategyGames);
    $("#partygames").click(filterPartyGames);
    $("#spooky").click(filterSpooky);
    $("#classicgames").click(filterClassicGames);      
}
    
// Utility functions
    
    // Change status text
    function changeText(text)
    {
        var display = document.getElementById('selectionDiv');
        display.innerHTML = "";
        display.innerHTML = text;
    }
         
    function defaultText()
    {
        var display = document.getElementById('selectionDiv');
        display.innerHTML = "";
        display.innerHTML = "Select A Game Type.";
    }


    // Clean crap out of #thecentercolumn div

    function disposeViz() {
    
        // Get rid of profile pic
        if(mainVizDiv.children("#profile").size() > 0) {mainVizDiv.empty();}     
        
        // Get rid of landing page
        if ($("#thecentercolumn").children("#landingpage").size() > 0 ) {$("#thecentercolumn").empty();}
        
        //Get rid of Customer Sat Table
        if ($("#thecentercolumn").children("#tblAppendGrid").size() > 0 ) {$("#thecentercolumn").empty();}
        
       //destory vizzes 
        if (typeof(mainViz) == 'undefined' || mainViz === null) {
            return;
        } else {
            mainViz.dispose();
        }
        
        //destroy slider
        try 
        {
            $("#slider").dateRangeSlider("destroy");
        }
        catch (err)
        {
            //ignore this error, it'll happen a bunch
        }
        
        // Remove Event Listener on Shipping dashboard
        mainViz.removeEventListener("marksselection", onMarksSelection);  

        // Get rid of select/submit buttons
        //$('#csButton').attr('disabled', 'disabled'); broken 

    }

    //Used to init date slider
    function initSlider()
    {
        // Init
        $("#slider").dateRangeSlider({
                bounds: {
                min: new Date(1998, 1, 1),
                max: new Date(2001, 11, 30)    
            },
              defaultValues:{
                min: new Date(1998, 1, 1),
                max: new Date(2001, 11, 30)
            },
                formatter:function(val){
                var days = val.getDate(),
                  month = val.getMonth() + 1,
                  year = val.getFullYear();
                return month + "/" + days + "/" + year;
            }
            
        });  

        
        
        
        
        
        // Event handler for date/time change            
        $("#slider").bind("valuesChanged", function(e, data){
          start = new Date(data.values.min);
          end = new Date(data.values.max);                       
          applyRangeFilterAsync(start, end)
        });
    }

    // Used to add buttons to header dynamically
    function initButtons(){
       // $("#check").button();
        $("#csButton").button();
        $("#csButton").click(function(){
            showGrid();
        });
        $("csButton").hide(); //BROKEN when using JQueryUI. GO figure. 
    }


// Tableau Stuff

    // Render a Viz
    function renderViz(dashboard) {
      
        disposeViz(); 
        // Define variables for viz
        mainWorkbookUrl = dashboard
    
        var mainVizOptions = {
            hideTabs: true,
            hideToolbar: true,
            width: "1221px",
            height: "551px",
            onFirstInteractive: function () {
                mainWorkbook = mainViz.getWorkbook();
                $("#menu").menu("collapseAll", null, true);
                // Watch mark selection only on shipping dashboard
                if(mainWorkbook.getActiveSheet().getName() == "Shipping Performance Dashboard") {
                    mainViz.addEventListener("marksselection", onMarksSelection);
                }

            }
        };
        //  Create viz
        mainViz = new tableauSoftware.Viz(mainVizDiv[0], mainWorkbookUrl, mainVizOptions);
    }

    // Filter Categories

   function filterWarfare(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
        if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Fighters",
                 "First Person Shooters",
                 "Giant Robots",
                 "Horizontal Shooter",
                 "Military Shooter",
                 "Vertical Shooter",
                 "Hex/Tile-based War",
                 "Squad-Level"]
                , "REPLACE");       

    }

   function filterSports(){
 
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Baseball",
                 "Basketball",
                 "Football (American)",
                 "Football (Soccer)",
                 "Golf",
                 "Racing"]
                , "REPLACE");       

    }

   function filterCardGames(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                "Card Games", "REPLACE");       

    }          
    
   function filterSwords(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Cerebral",
                 "Interactive Fiction",
                 "Multi-genre Adventure",
                 "Rogues",
                 "Space",
                 "Squad-Level"]
                , "REPLACE");          

    }
    
   function filterPartyGames(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Brain Teasers",
                 "Game Shows",
                 "Word Games and Trivia"]
                , "REPLACE");          

    }

   function filterStrategyGames(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Card Games",
                 "Cerebral",
                 "Tetris Variants",
                 "Squad-Level",
                 "Empire Management",
                 "Hex/Tile-based War",
                 "Multi-genre Strategy"]
                 , "REPLACE");          

    }

function filterSpooky(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Rogues",
                 "Cerebral",
                 "Other Action",
                 "Hybrid",
                 "Interactive Fiction"]
                 , "REPLACE");          

    }

function filterClassicGames(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
           if (whichViz == "Sales" || whichViz == "None" || whichViz == "Shipping") {   
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                ["Pinball",
                 "Tetris Variants",
                 "Breakout Variants"]
                 , "REPLACE");          

    }

function applyRangeFilterAsync(start, end) {


       worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Time");
       
        var beginDate = new Date(start);
        var endDate = new Date(end);
        // Specify range to be used by applyRangeFilterAsync
		var filterOptions = {
            min: beginDate,
            max: endDate
        };

		// Apply filter
        worksheet.applyRangeFilterAsync("Order Date", filterOptions);

}

function onMarksSelection(event) {
	getSelectedMarksAsync();
    console.log('I fired');
}

function getSelectedMarksAsync() {

    mainWorkbook = mainViz.getWorkbook();
	
	var onSuccess =  function(result)
    {

        var selectedMarks = result;
        alertOutput = "[\n";
        if (selectedMarks.length > 0) 
         {
            // Each selected Mark
            $.each(selectedMarks, function (i, mark) {
                // Each Mark has Pairs, build up JSON
                alertOutput = alertOutput + "{";
                    $.each(mark.getPairs(), function (j, pair) {
                        fieldName = pair.fieldName;
                        fieldValue = pair.value;
                        // no command if this is the first field in the row
                        if(fieldName != "AVG(Shipping Lag)") {alertOutput = alertOutput + ",";}
                        
                        // if Sales, Profit then format as currency, else two digits
                        if (fieldName == "SUM(Sales)" || fieldName == "SUM(Profit)") {
                            fieldValue = accounting.formatMoney (fieldValue);
                        }
                        else if (fieldName == "AVG(Shipping Lag)") {
                            fieldValue = accounting.formatNumber(fieldValue,3);            
                        }
                                
                        alertOutput = alertOutput + "'" + fieldName + "': '" + fieldValue + "'";
                    });
                    alertOutput = alertOutput + ",'Submit': false},\n";
                });
                alertOutput = alertOutput.slice(0, -2);
                alertOutput = alertOutput + "\n]";
            }
            console.log(alertOutput);
    }	

	var  onError =  function(message) {
		console.log("Error: '" + message + "'");
	}
	
    // Assumes we're sitting on "Profit v Sales" sheet
	sheet = mainWorkbook.getActiveSheet().getWorksheets().get("Shipping Perf Per Customer");

    // See above for promise defintion of onSuccess, onError
    sheet.getSelectedMarksAsync().then(onSuccess, onError);
}

function showGrid(){
    
    disposeViz();
    $("#thecentercolumn").append('<table id="tblAppendGrid"></table>');
    // Initialize appendGrid
    $('#tblAppendGrid').appendGrid({
        caption: 'Customers to be submitted for service call downs and rescue',
        initRows: 1,
        columns: [
                { name: 'Submit', display: 'Submit?', type: 'checkbox' },
                { name: 'Customer Name', display: 'Customer Name', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px'} },
                { name: 'AVG(Shipping Lag)', display: 'Average Shipping Lag', type: 'text', ctrlAttr: { maxlength: 3 }, ctrlCss: { width: '160px', 'text-align': 'right' }, value: 0 },   
                { name: 'SUM(Profit)', display: 'Lifetime Profit', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '160px', 'text-align': 'right' }, value: 0 }, 
                { name: 'SUM(Sales)', display: 'Lifetime Sales', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '160px', 'text-align': 'right' }, value: 0 } 
                ],
        hideRowNumColumn: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            append: true,
            insert: true
        },
        customFooterButtons: [
                { uiButton: { icons: { primary: 'ui-icon-check' }, label: "Complete" }, btnAttr: { title: 'Clicking this button will submit selected customers to the CSAT rescue process' }, click: function (evt) { finish() }, atTheFront: true }
            ]
    });
     // Load Rows
    var myRows = eval('(' + alertOutput + ')');
    $('#tblAppendGrid').appendGrid('load', myRows);

                            
}

function finish(){
    alert("Customers submitted to follow-up. Returning to Dashboard.");
    whichViz = "Sales"; // Track which viz is being displayed...
    renderViz('https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/SalesDashboard');  
}

