var ViewManager = function(currentViewId){
    this.isChangingPage = false;
    this.currentViewId = currentViewId;
    this.viewIdStack = [];
    this.viewAssembler = new ViewAssembler({backDelegate: this, changePageDelegate: this});

    $('.SPage').hide();
    this.viewAssembler.assembleView(currentViewId, {});
    this.viewAssembler.assembleMainHeader(currentViewId, {});
    $(currentViewId).show();
};

ViewManager.prototype.changePage = function(newPageId, options){
    if(this.isChangingPage){
        return;
    }
    this.isChangingPage = true;
    this.viewIdStack.push(this.currentViewId);
    var assembler = this.viewAssembler;
    $(this.currentViewId).fadeOut(200, function(){
        $(newPageId).fadeIn(300, function(){
            assembler.changePageDelegate.isChangingPage = false;
        });
        assembler.assembleMainHeader(newPageId, options);
    });
    this.currentViewId = newPageId;
    this.viewAssembler.assembleView(newPageId, options);
};





ViewManager.prototype.backPage = function(){
        $(this.currentViewId).hide();
        this.currentViewId = this.viewIdStack.pop();
        $(this.currentViewId).show();
    };

