//---Globals
var mainWorkbookUrl = "https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/SalesDashboard";
var mainVizDiv, mainViz, whichViz="None";

function initialize(){
   
    // Viz div
    mainVizDiv = $('#thecentercolumn');

    //Menu selection    
    $( "#menu" ).menu({ select: function( event, ui ) 
        {
            menuSelection = ui.item.text();
            switch (menuSelection){
                case "My Profile":
                    disposeViz();
                    mainVizDiv.append("<img id='profile' src='images/Profile.jpg' alt='Stylin and Profilin' align='middle'/>");        
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
                    //Remove Bacon Text
                    //$("#bacon").remove();
                    break;
                case "Shipping / CSAT":
                    whichViz = "Shipping"; // Track which viz is being displayed...
                    renderViz('https://tableau.russellchristopher.org/t/SkunkWorks/views/CerebralGameSelling/ShippingPerformanceDashboard');
                    break;
                case "Another Item":

                    break;
                }
    
        }
    });
    
    // Add click events to each button image
    $("#warfare").click(filterCategories('warfare'));
    $("#sports").click(filterCategories("sports"));
    $("#cardgames").click(filterCategories("cardgames"));
    $("#swords").click(filterCategories("swords"));
    $("#strategygames").click(filterCategories("strategygames"));
    $("#partygames").click(filterCategories("partygames"));
    $("#spooky").click(filterCategories("spooky"));
    $("#classicgames").click(filterCategories("classicgames"));      
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
            console.log(err);
        }
            
        

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
           }});  
        // Event handler for date/time change            
        $("#slider").bind("valuesChanged", function(e, data){
          start = new Date(data.values.min);
          end = new Date(data.values.max);                       
          applyRangeFilterAsync(start, end)
        });
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

            }
        };
        //  Create viz
        mainViz = new tableauSoftware.Viz(mainVizDiv[0], mainWorkbookUrl, mainVizOptions);
    }

    // Filter Categories

    function filterCategories(whichCategory){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
        if (whichViz != "Activity Report") {
            changeText('Not Right Now.'); 
            return 0;
        }


       var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
       category = whichCategory;
        
        switch (category)
        {
         case "warfare":
                filterList =["Fighters",
                 "First Person Shooters",
                 "Giant Robots",
                 "Horizontal Shooter",
                 "Military Shooter",
                 "Vertical Shooter",
                 "Hex/Tile-based War",
                 "Squad-Level"];
            break;
        case "sports":
            filterList = ["Baseball",
                     "Basketball",
                     "Football (American)",
                     "Football (Soccer)",
                     "Golf",
                     "Racing"]; 
            break;
        case "cardgames":
            cardgames = ["Card Games"];   
            break;
        case "swords":
            filterList = ["Cerebral",
                 "Interactive Fiction",
                 "Multi-genre Adventure",
                 "Rogues",
                 "Space",
                 "Squad-Level"];
            break;
        case "partygames":           
            filterList=["Brain Teasers",
                 "Game Shows",
                 "Word Games and Trivia"];          
            break;
        case "strategygames":
            filterList = ["Card Games",
                 "Cerebral",
                 "Tetris Variants",
                 "Squad-Level",
                 "Empire Management",
                 "Hex/Tile-based War",
                 "Multi-genre Strategy"];
            break;
        case "spooky":
            filterList = ["Rogues",
                 "Cerebral",
                 "Other Action",
                 "Hybrid",
                 "Interactive Fiction"]; 
            break;
        case "classicgames":        
            filterList =  ["Pinball",
                 "Tetris Variants",
                 "Breakout Variants"];
            break;
        }
       
        worksheet.applyFilterAsync("Sub-Genre",filterList, "REPLACE");          

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
