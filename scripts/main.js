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
                    $("#slider").dateRangeSlider({
                        bounds: {
                        min: new Date(1998, 1, 1),
                        max: new Date(2001, 11, 30)    
                    },
                      defaultValues:{
                        min: new Date(1998, 1, 1),
                        max: new Date(2001, 11, 30)
                      }});

                    //Remove Bacon Text
                    $("#bacon").remove();
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
          if(mainVizDiv.children("#profile").size() > 0) {mainVizDiv.empty();}      
        
        if (typeof(mainViz) == 'undefined' || mainViz === null) {
            return;
        } else {
            mainViz.dispose();
        }

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

    function filterWarfare(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
            changeText('Not Right Now.'); 
            return 0;
        }


        var worksheet = mainViz.getWorkbook().getActiveSheet().getWorksheets().get("Profit by Genre");
        worksheet.applyFilterAsync("Sub-Genre",     
                "Card Games", "REPLACE");       

    }          
    
   function filterSwords(){
       
        // This button shouldn't do anything if we are viewing the Sales dashboard
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
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
        if (whichViz == "Sales" || whichViz == "None") {
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
