(function(){var a=YAHOO.util.Dom,n=YAHOO.util.Element,i=YAHOO.util.KeyListener;Alfresco.FlashUpload=function(E){Alfresco.FlashUpload.superclass.constructor.call(this,"Alfresco.FlashUpload",E,["button","container","datatable","datasource","cookie","uploader"]);this.swf=Alfresco.constants.URL_CONTEXT+"res/yui/uploader/assets/uploader.swf?dt="+(new Date()).getTime();this.hasRequiredFlashPlayer=Alfresco.util.hasRequiredFlashPlayer(9,0,45);this.fileStore={};this.addedFiles={};this.defaultShowConfig={siteId:null,containerId:null,destination:null,uploadDirectory:null,updateNodeRef:null,updateFilename:null,updateVersion:"1.0",mode:this.MODE_SINGLE_UPLOAD,filter:[],onFileUploadComplete:null,overwrite:false,thumbnails:null,uploadURL:null,username:null,suppressRefreshEvent:false};this.suppliedConfig={};this.showConfig={};this.fileItemTemplates={};return this};YAHOO.extend(Alfresco.FlashUpload,Alfresco.component.Base,{contentReady:false,STATE_BROWSING:1,STATE_UPLOADING:2,STATE_FINISHED:3,STATE_FAILURE:4,STATE_SUCCESS:5,STATE_ILLEGAL_FILENAME:6,state:1,fileStore:null,noOfSuccessfulUploads:0,noOfFailedUploads:0,addedFiles:null,MODE_SINGLE_UPLOAD:1,MODE_SINGLE_UPDATE:2,MODE_MULTI_UPLOAD:3,defaultShowConfig:null,suppliedConfig:null,showConfig:null,uploader:null,uploaderReady:false,titleText:null,multiUploadTip:null,singleUpdateTip:null,statusText:null,minorVersion:null,majorVersion:null,description:null,versionSection:null,fileItemTemplates:null,_iePageTitleBackup:null,metadataSection:null,m_tags:null,m_categories:null,onReady:function y(){this._iePageTitleBackup=document.title;YAHOO.widget.Uploader.SWFURL=this.swf;a.removeClass(this.id+"-dialog","hidden");this.widgets.panel=Alfresco.util.createYUIPanel(this.id+"-dialog");this.widgets.panel.hideEvent.subscribe(this.onCancelOkButtonClick,null,this);if(this.widgets.panel.platform=="mac"&&YAHOO.env.ua.gecko){var E=YAHOO.util.Config,F=this.widgets.panel;if(E.alreadySubscribed(F.showEvent,F.showMacGeckoScrollbars,F)){F.showEvent.unsubscribe(F.showMacGeckoScrollbars,F)}if(E.alreadySubscribed(F.hideEvent,F.hideMacGeckoScrollbars,F)){F.hideEvent.unsubscribe(F.hideMacGeckoScrollbars,F)}a.addClass(F.element,"reinstantiated-fix")}this.fileItemTemplates.left=a.get(this.id+"-left-div");this.fileItemTemplates.center=a.get(this.id+"-center-div");this.fileItemTemplates.right=a.get(this.id+"-right-div");this._createEmptyDataTable();this.titleText=a.get(this.id+"-title-span");this.multiUploadTip=a.get(this.id+"-multiUploadTip-span");this.singleUpdateTip=a.get(this.id+"-singleUpdateTip-span");this.statusText=a.get(this.id+"-status-span");this.description=a.get(this.id+"-description-textarea");this.minorVersion=a.get(this.id+"-minorVersion-radioButton");this.majorVersion=a.get(this.id+"-majorVersion-radioButton");this.versionSection=a.get(this.id+"-versionSection-div");this.widgets.uploadButton=Alfresco.util.createYUIButton(this,"upload-button",this.onUploadButtonClick);this.widgets.cancelOkButton=Alfresco.util.createYUIButton(this,"cancelOk-button",this.onCancelOkButtonClick);this.metadataSection=a.get(this.id+"-metadata-table-container");this.m_tags=a.get(this.id+"-custom-tag-picker");this.m_categories=a.get(this.id+"-custom-category-picker");this.m_tagsCurrentValueDisplayDiv=a.get(this.id+"-custom-tag-picker-cntrl-currentValueDisplay");this.m_categoriesCurrentValueDisplayDiv=a.get(this.id+"-custom-category-picker-cntrl-currentValueDisplay");this.uploader=new YAHOO.widget.Uploader(this.id+"-flashuploader-div",Alfresco.constants.URL_RESCONTEXT+"themes/"+Alfresco.constants.THEME+"/images/upload-button-sprite.png",true);this.uploader.subscribe("fileSelect",this.onFileSelect,this,true);this.uploader.subscribe("uploadComplete",this.onUploadComplete,this,true);this.uploader.subscribe("uploadProgress",this.onUploadProgress,this,true);this.uploader.subscribe("uploadStart",this.onUploadStart,this,true);this.uploader.subscribe("uploadCancel",this.onUploadCancel,this,true);this.uploader.subscribe("uploadCompleteData",this.onUploadCompleteData,this,true);this.uploader.subscribe("uploadError",this.onUploadError,this,true);this.uploader.subscribe("contentReady",this.onContentReady,this,true);this.widgets.escapeListener=new i(document,{keys:i.KEY.ESCAPE},{fn:this.onCancelOkButtonClick,scope:this,correctScope:true})},onContentReady:function q(E){this.uploader.enable();this.uploader.setAllowMultipleFiles(this.showConfig.mode===this.MODE_MULTI_UPLOAD);if(this.showConfig.filter){this.uploader.setFileFilters(this.showConfig.filter)}},show:function d(G){if(!this.hasRequiredFlashPlayer){Alfresco.util.PopupManager.displayPrompt({text:this.msg("label.noFlash")})}this.suppliedConfig=G;this.showConfig=YAHOO.lang.merge(this.defaultShowConfig,G);if(this.showConfig.uploadDirectory===undefined&&this.showConfig.updateNodeRef===undefined){throw new Error("An updateNodeRef OR uploadDirectory must be provided")}if(this.showConfig.uploadDirectory!==null&&this.showConfig.uploadDirectory.length===0){this.showConfig.uploadDirectory="/"}var J=this.id+"-flashuploader-div";a.removeClass(J,"hidden");this._resetGUI();this._applyConfig();this.widgets.escapeListener.enable();var F=a.getChildren(this.id+"-flashuploader-div"),K,I;for(var H=0,E=F.length;H<E;H++){K=F[H];I=K.tagName.toLowerCase();if(I=="a"){K.parentNode.removeChild(K)}}this.widgets.panel.setFirstLastFocusable();this.widgets.panel.show();if(navigator.userAgent&&navigator.userAgent.indexOf("Ubuntu")!=-1&&YAHOO.env.ua.gecko>1&&!a.hasClass(J,"button-fix")){a.addClass(J,"button-fix")}if(YAHOO.env.ua.ie){document.title=this._iePageTitleBackup}},hide:function s(){this.onCancelOkButtonClick()},_resetGUI:function D(){if(this.statusText==null){this.onReady()}this.state=this.STATE_BROWSING;this.noOfFailedUploads=0;this.noOfSuccessfulUploads=0;this.statusText.innerHTML="&nbsp;";this.description.value="";this.minorVersion.checked=true;this.minorVersion.disabled=false;this.majorVersion.disabled=false;this.description.disabled=false;this.widgets.uploadButton.set("label",this.msg("button.upload"));this.widgets.uploadButton.set("disabled",true);a.removeClass(this.id+"-upload-button","hidden");this.widgets.cancelOkButton.set("label",this.msg("button.cancel"));this.widgets.cancelOkButton.set("disabled",false);if(this.m_tags!=null){this.m_tags.value=""}if(this.m_categories!=null){this.m_categories.value=""}if(this.m_tagsCurrentValueDisplayDiv!=null){this.m_tagsCurrentValueDisplayDiv.innerHTML=""}if(this.m_categoriesCurrentValueDisplayDiv!=null){this.m_categoriesCurrentValueDisplayDiv.innerHTML=""}},onPostRenderEvent:function t(){for(var H in this.fileStore){var F=this.fileStore[H];if(F!=null&&F.state==this.STATE_ILLEGAL_FILENAME){var G=this.msg("label.illegalChars");F.progressInfo.innerHTML=F.progressInfo.innerHTML+" "+G;F.progressInfo.setAttribute("title",G);F.progressInfoCell.setAttribute("title",G);a.removeClass(F.progress,"fileupload-progressSuccess-span");a.addClass(F.progress,"fileupload-progressFailure-span");a.setStyle(F.progress,"left",0+"px");F.state=this.STATE_FAILURE;this.noOfFailedUploads++;this._updateStatus()}}if(this.noOfFailedUploads==0){this._clearStatus()}var E=this.widgets.dataTable.getRecordSet().getLength();if(E>0&&E>this.noOfFailedUploads){this.widgets.uploadButton.set("disabled",false);this.widgets.panel.setFirstLastFocusable();this.widgets.panel.focusFirst()}if(this.showConfig.mode===this.MODE_SINGLE_UPDATE&&this.widgets.panel.cfg.getProperty("visible")){if(this.widgets.dataTable.getRecordSet().getLength()===0){this.uploader.enable()}else{this.uploader.disable()}}},onRowDeleteEvent:function f(E){this.widgets.panel.setFirstLastFocusable();this.widgets.panel.focusFirst()},onFileSelect:function v(G){if(YAHOO.env.ua.ie){document.title=this._iePageTitleBackup}this.widgets.uploadButton.set("disabled",true);var I=[],H,E;for(var F in G.fileList){H=YAHOO.widget.DataTable._cloneObject(G.fileList[F]);E=this._getUniqueFileToken(H);if(!this.addedFiles[E]){if(H.size===0&&!this.addedFiles[E]){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.zeroByteFileSelected",H.name)})}else{I.push(H)}this.addedFiles[E]=E}}this.widgets.dataTable.addRows(I,0)},onUploadStart:function p(F){var E=this.fileStore[F.id];if(E.contentType){a.addClass(E.contentType,"hidden")}E.progressPercentage.innerHTML="0%";a.removeClass(E.progressPercentage,"hidden");E.state=this.STATE_UPLOADING},onUploadProgress:function k(H){var G=H.id;var F=this.fileStore[G];var E=H.bytesLoaded/H.bytesTotal;F.progressPercentage.innerHTML=Math.round(E*100)+"%";var I=(-400+(E*400));a.setStyle(F.progress,"left",I+"px")},onUploadComplete:function w(E){},onUploadCompleteData:function B(H){var G=this.fileStore[H.id];G.state=this.STATE_SUCCESS;G.fileButton.set("disabled",true);var F=G.fileName;var E=Alfresco.util.parseJSON(H.data);if(E){G.nodeRef=E.nodeRef;G.fileName=E.fileName;G.rawJson=E}G.fileSizeInfo.innerHTML=G.fileSizeInfo.innerHTML+" ("+this.msg("label.success")+")";a.removeClass(G.progress,"fileupload-progressSuccess-span");a.addClass(G.progress,"fileupload-progressFinished-span");a.setStyle(G.progress,"left",0+"px");G.progressPercentage.innerHTML="100%";this.noOfSuccessfulUploads++;this._updateStatus();this._uploadFromQueue(1);this._adjustGuiIfFinished()},onUploadCancel:function A(E){},onUploadError:function c(G){var F=this.fileStore[G.id];if(F.state!==this.STATE_FAILURE){F.state=this.STATE_FAILURE;var E="label.failure."+G.status,H=Alfresco.util.message(E,this.name);if(H==E){H=Alfresco.util.message("label.failure",this.name)}F.fileSizeInfo.innerHTML=F.fileSizeInfo.innerHTML+" ("+H+")";F.progressInfo.setAttribute("title",H);F.progressInfoCell.setAttribute("title",H);a.removeClass(F.progress,"fileupload-progressSuccess-span");a.addClass(F.progress,"fileupload-progressFailure-span");a.setStyle(F.progress,"left",0+"px");F.fileButton.set("disabled",true);this.noOfFailedUploads++;this._updateStatus();this._uploadFromQueue(1);this._adjustGuiIfFinished()}},_onFileButtonClickHandler:function b(F,E){var G=this.widgets.dataTable.getRecordSet().getRecord(E);this.addedFiles[this._getUniqueFileToken(G.getData())]=null;this.widgets.dataTable.deleteRow(G);if(this.fileStore[F].state==this.STATE_FAILURE){this.noOfFailedUploads--;this._updateStatus()}this.fileStore[F]=null;if(this.state===this.STATE_BROWSING){this.uploader.removeFile(F);if(this.widgets.dataTable.getRecordSet().getLength()===0){this.widgets.uploadButton.set("disabled",true);this.uploader.enable()}}else{if(this.state===this.STATE_UPLOADING){this.uploader.cancel(F);this._uploadFromQueue(1);this._updateStatus();this._adjustGuiIfFinished()}}},onCancelOkButtonClick:function o(){var G,F;if(this.state===this.STATE_BROWSING){}else{if(this.state===this.STATE_UPLOADING){this._cancelAllUploads();var E=0;for(F in this.fileStore){if(this.fileStore[F]&&this.fileStore[F].state===this.STATE_SUCCESS){E++}}if(E>0){G=YAHOO.lang.substitute(this.msg("message.cancelStatus"),{"0":E})}if(!this.showConfig.suppressRefreshEvent){YAHOO.Bubbling.fire("metadataRefresh",{currentPath:this.showConfig.path})}}else{if(this.state===this.STATE_FINISHED){var I=null,H;for(F in this.fileStore){H=this.fileStore[F];if(H&&H.state===this.STATE_SUCCESS){I=H.fileName;break}}if(!this.showConfig.suppressRefreshEvent){if(I){YAHOO.Bubbling.fire("metadataRefresh",{currentPath:this.showConfig.path,highlightFile:I})}else{YAHOO.Bubbling.fire("metadataRefresh",{currentPath:this.showConfig.path})}}}}}this._clear();this.widgets.panel.hide();a.addClass(this.id+"-flashuploader-div","hidden");this.widgets.escapeListener.disable();if(G){Alfresco.util.PopupManager.displayPrompt({text:G})}},onUploadButtonClick:function m(){if(this.state===this.STATE_BROWSING){var E=this.widgets.dataTable.getRecordSet().getLength();if(E>0){this.state=this.STATE_UPLOADING;this.widgets.uploadButton.set("disabled",true);this.minorVersion.disabled=true;this.majorVersion.disabled=true;this.description.disabled=true;this.uploader.disable();this._updateStatus()}this._uploadFromQueue(2)}},_applyConfig:function e(){var J;if(this.showConfig.mode===this.MODE_SINGLE_UPLOAD){J=this.msg("header.singleUpload")}else{if(this.showConfig.mode===this.MODE_MULTI_UPLOAD){J=this.msg("header.multiUpload")}else{if(this.showConfig.mode===this.MODE_SINGLE_UPDATE){J=this.msg("header.singleUpdate")}}}this.titleText.innerHTML=J;if(this.showConfig.mode===this.MODE_SINGLE_UPDATE){this.singleUpdateTip.innerHTML=YAHOO.lang.substitute(this.msg("label.singleUpdateTip"),{"0":this.showConfig.updateFilename});a.addClass(this.metadataSection,"hidden");a.removeClass(this.versionSection,"hidden");var F=(this.showConfig.updateVersion||"1.0").split("."),E=parseInt(F[0],10),I=parseInt(F[1],10);a.get(this.id+"-minorVersion").innerHTML=this.msg("label.minorVersion.more",E+"."+(1+I));a.get(this.id+"-majorVersion").innerHTML=this.msg("label.majorVersion.more",(1+E)+".0")}else{a.removeClass(this.metadataSection,"hidden");a.addClass(this.versionSection,"hidden")}if(this.showConfig.mode===this.MODE_MULTI_UPLOAD){a.removeClass(this.statusText,"hidden");a.removeClass(this.multiUploadTip,"hidden");a.addClass(this.singleUpdateTip,"hidden")}else{a.addClass(this.statusText,"hidden");a.addClass(this.multiUploadTip,"hidden");if(this.showConfig.mode===this.MODE_SINGLE_UPDATE){a.removeClass(this.singleUpdateTip,"hidden")}else{a.addClass(this.singleUpdateTip,"hidden")}this.widgets.dataTable.set("height","40px")}var H=a.get(this.id+"-flashuploader-div");var G=a.getFirstChild(H);if(G&&G.tagName.toLowerCase()=="p"){a.setStyle(H,"height","30px");a.setStyle(H,"height","200px")}else{this._applyUploaderConfig({multiSelect:this.showConfig.mode===this.MODE_MULTI_UPLOAD,filter:this.showConfig.filter},0)}},_applyUploaderConfig:function(H,E){try{this.uploader.enable();this.uploader.setAllowMultipleFiles(H.multiSelect);this.uploader.setFileFilters(H.filter)}catch(G){if(E==7){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.flashError.title"),text:this.msg("message.flashError.message"),buttons:[{text:Alfresco.util.message("button.ok"),handler:{fn:function I(K,L){this.destroy();L.widgets.panel.destroy();var J=L._disableFlashUploader();if(J){J.show(L.suppliedConfig)}},obj:this},isDefault:true},{text:Alfresco.util.message("button.refreshPage"),handler:function F(){window.location.reload(true)}}]})}else{YAHOO.lang.later(100,this,this._applyUploaderConfig,[H,++E])}}},_disableFlashUploader:function l(){var E=Alfresco.util.ComponentManager.findFirst("Alfresco.FileUpload");if(E){E.options.adobeFlashEnabled=false}return E},_createEmptyDataTable:function h(){var E=this;var F=function(L,M,N,O){E._formatCellElements(L,M,E.fileItemTemplates.left)};var K=function(L,M,N,O){E._formatCellElements(L,M,E.fileItemTemplates.center)};var I=function(L,M,N,O){E._formatCellElements(L,M,E.fileItemTemplates.right)};this._formatCellElements=function(N,ab,X){var U=ab.getData(),Y=U.id;if(!this.fileStore[Y]){var aa=this.STATE_BROWSING;var P={id:Y,value:U.name};if(!Alfresco.forms.validation.nodeName(P,{},null,null,true,null)){aa=this.STATE_ILLEGAL_FILENAME}else{}this.fileStore[Y]={state:aa,fileName:U.name,nodeRef:null}}var Z=new n(N);var S=X.cloneNode(true);S.setAttribute("id",S.getAttribute("id")+Y);var M=a.getElementsByClassName("fileupload-progressSuccess-span","span",S);if(M.length==1){this.fileStore[Y].progress=M[0]}var V=a.getElementsByClassName("fileupload-progressInfo-span","span",S);if(V.length==1){var O=U.name;S.setAttribute("title",O);V=V[0];this.fileStore[Y].progressInfo=V;this.fileStore[Y].progressInfo.innerHTML=O;this.fileStore[Y].progressInfoCell=N}var R=a.getElementsByClassName("fileupload-filesize-span","span",S);if(R.length==1){var O=Alfresco.util.formatFileSize(U.size);R=R[0];this.fileStore[Y].fileSizeInfo=R;R.innerHTML=O}var W=a.getElementsByClassName("fileupload-contentType-select","select",S);if(W.length==1){this.fileStore[Y].contentType=W[0]}else{W=a.getElementsByClassName("fileupload-contentType-input","input",S);if(W.length==1){this.fileStore[Y].contentType=W[0]}}var T=a.getElementsByClassName("fileupload-percentage-span","span",S);if(T.length==1){this.fileStore[Y].progressPercentage=T[0]}var L=a.getElementsByClassName("fileupload-file-button","button",S);if(L.length==1){var Q=new YAHOO.widget.Button(L[0],{type:"button",disabled:false});Q.subscribe("click",function(){this._onFileButtonClickHandler(Y,ab.getId())},this,true);this.fileStore[Y].fileButton=Q}Z.appendChild(S)};var J=[{key:"id",className:"col-left",resizable:false,formatter:F},{key:"name",className:"col-center",resizable:false,formatter:K},{key:"created",className:"col-right",resizable:false,formatter:I}];var H=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY});YAHOO.widget.DataTable._bStylesheetFallback=!!YAHOO.env.ua.ie;var G=a.get(this.id+"-filelist-table");this.widgets.dataTable=new YAHOO.widget.DataTable(G,J,H,{scrollable:true,height:"100px",width:"620px",renderLoopSize:1,MSG_EMPTY:this.msg("label.noFiles")});this.widgets.dataTable.subscribe("postRenderEvent",this.onPostRenderEvent,this,true);this.widgets.dataTable.subscribe("rowDeleteEvent",this.onRowDeleteEvent,this,true)},_getUniqueFileToken:function C(E){return E.name+":"+E.size+":"+E.cDate+":"+E.mDate},_updateStatus:function g(){this.statusText.innerHTML=YAHOO.lang.substitute(this.msg("label.uploadStatus"),{"0":this.noOfSuccessfulUploads,"1":this.widgets.dataTable.getRecordSet().getLength(),"2":this.noOfFailedUploads})},_clearStatus:function j(){this.statusText.innerHTML=""},_adjustGuiIfFinished:function x(){var G={successful:[],failed:[]};var F=null;for(var E in this.fileStore){F=this.fileStore[E];if(F){if(F.state==this.STATE_SUCCESS){G.successful.push({fileName:F.fileName,nodeRef:F.nodeRef,response:F.rawJson})}else{if(F.state==this.STATE_FAILURE){G.failed.push({fileName:F.fileName})}else{return}}}}this.state=this.STATE_FINISHED;if(!this.showConfig.suppressRefreshEvent){this.widgets.cancelOkButton.set("label",this.msg("button.ok"));this.widgets.cancelOkButton.focus()}else{this.widgets.cancelOkButton.set("disabled",true)}this.widgets.uploadButton.set("disabled",true);a.addClass(this.id+"-upload-button","hidden");var H=this.showConfig.onFileUploadComplete;if(H&&typeof H.fn=="function"){H.fn.call((typeof H.scope=="object"?H.scope:this),G,H.obj)}},_uploadFromQueue:function z(M){var F;if(this.showConfig.uploadURL===null){F=Alfresco.constants.PROXY_URI+"api/upload"}else{F=Alfresco.constants.PROXY_URI+this.showConfig.uploadURL}F+=";jsessionid="+YAHOO.util.Cookie.get("JSESSIONID")+"?lang="+Alfresco.constants.JS_LOCALE;if(Alfresco.util.CSRFPolicy.isFilterEnabled()){F+="&"+Alfresco.util.CSRFPolicy.getParameter()+"="+encodeURIComponent(Alfresco.util.CSRFPolicy.getToken())}var E=0,G=this.widgets.dataTable.getRecordSet().getLength(),J,L,K,H;for(var I=0;I<G&&E<M;I++){J=this.widgets.dataTable.getRecordSet().getRecord(I);L=J.getData("id");K=this.fileStore[L];if(K.state===this.STATE_BROWSING){K.state=this.STATE_UPLOADING;H={username:this.showConfig.username};if(this.showConfig.siteId!==null){H.siteId=this.showConfig.siteId;H.containerId=this.showConfig.containerId}else{if(this.showConfig.destination!==null){H.destination=this.showConfig.destination}}if(this.showConfig.mode===this.MODE_SINGLE_UPDATE){H.updateNodeRef=this.showConfig.updateNodeRef;H.majorVersion=!this.minorVersion.checked;H.description=this.description.value}else{if(this.showConfig.uploadDirectory!==null){H.uploadDirectory=this.showConfig.uploadDirectory}if(K.contentType){if(K.contentType.tagName.toLowerCase()=="select"){H.contentType=K.contentType.options[K.contentType.selectedIndex].value}else{H.contentType=K.contentType.value}}H.overwrite=this.showConfig.overwrite;if(this.showConfig.thumbnails){H.thumbnails=this.showConfig.thumbnails}if(Alfresco.constants.PAGEID=="documentlibrary"){H.prop_cm_taggable=this.m_tags.value;H.prop_cm_categories=this.m_categories.value}}this.uploader.upload(L,F,"POST",H,"filedata");E++}}},_cancelAllUploads:function r(){var H=this.widgets.dataTable.getRecordSet().getLength();for(var G=0;G<H;G++){var E=this.widgets.dataTable.getRecordSet().getRecord(G);var F=E.getData("id");this.uploader.cancel(F)}},_clear:function u(){var E=this.widgets.dataTable.getRecordSet().getLength();this.addedFiles={};this.fileStore={};this.widgets.dataTable.deleteRows(0,E);this.uploader.clearFileList()}})})();