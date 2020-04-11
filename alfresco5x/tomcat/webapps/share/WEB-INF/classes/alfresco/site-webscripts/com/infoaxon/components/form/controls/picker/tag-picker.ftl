<#assign tagPickerId = (args.htmlid?html) + "-custom-tag-picker">

<script type="text/javascript">//<![CDATA[
(function()
{
   var picker = new Alfresco.ObjectFinder("${tagPickerId}-cntrl", "${tagPickerId}").setOptions(
   {      
      field: "prop_cm_taggable",
      compactMode: true,
      mandatory: false,
      currentValue: "",      
      selectActionLabel: "Select",
      minSearchTermLength: 1,
      maxSearchResults: 100
   }).setMessages(
      ${messages}
   );
   picker.setOptions(
   {
      itemType: "cm:category",
      multipleSelectMode: true,
      parentNodeRef: "alfresco://category/root",
      itemFamily: "category",
      maintainAddedRemovedItems: false,
      params: "aspect=cm:taggable",
      createNewItemUri: "/api/tag/workspace/SpacesStore",
      createNewItemIcon: "tag",
	  pickerType: "tag"
   });
})();
//]]></script>

<div class="form-field inlineable">	      
	<div id="${tagPickerId}-cntrl" class="object-finder inlineable"> 
		<div class="hidden" >
			<input id="${tagPickerId}-cntrl-tag-text" type="text" tabindex="0" style="width:13em;vertical-align: super;"/>
			<input id="${tagPickerId}-cntrl-add-tag-button" type="button" value="${msg("button.add")}" tabindex="0"/>
		</div>
		<div id="${tagPickerId}-cntrl-currentValueDisplay" class="current-values inlineable">
		</div>         
        <input type="hidden" id="${tagPickerId}" name="prop_cm_taggable" value="" />
		<div id="${tagPickerId}-cntrl-itemGroupActions" class="show-picker inlineable">
		</div>         
		<div id="${tagPickerId}-cntrl-picker" class="picker yui-panel">
			<div id="${tagPickerId}-cntrl-picker-head" class="hd">
				Selecione as tags...
			</div>
			<div id="${tagPickerId}-cntrl-picker-body" class="bd">
				<div class="picker-header">
					<div id="${tagPickerId}-cntrl-picker-folderUpContainer" class="folder-up" style="display:none">
						<button id="${tagPickerId}-cntrl-picker-folderUp"></button>
					</div>
					<div id="${tagPickerId}-cntrl-picker-navigatorContainer" class="navigator">
						<button id="${tagPickerId}-cntrl-picker-navigator"></button>
						<div id="${tagPickerId}-cntrl-picker-navigatorMenu" class="yuimenu">
							<div class="bd">
								<ul id="${tagPickerId}-cntrl-picker-navigatorItems" class="navigator-items-list">
									<li>&nbsp;</li>
								</ul>
							</div>
						</div>
					</div>
					<div id="${tagPickerId}-cntrl-picker-searchContainer" class="search">
						<input type="text" class="search-input" name="-" id="${tagPickerId}-cntrl-picker-searchText" value="" maxlength="256" />
						<span class="search-button"><button id="${tagPickerId}-cntrl-picker-searchButton">Search</button></span>
					</div>
				</div>
				<div class="yui-g">
					<div id="${tagPickerId}-cntrl-picker-left" class="yui-u first panel-left">
						<div id="${tagPickerId}-cntrl-picker-results" class="picker-items">
						</div>
					</div>
					<div id="${tagPickerId}-cntrl-picker-right" class="yui-u panel-right">
						<div id="${tagPickerId}-cntrl-picker-selectedItems" class="picker-items">
						</div>
					</div>
				</div>
				<div class="bdft">
					<button id="${tagPickerId}-cntrl-ok" tabindex="0">OK</button>
					<button id="${tagPickerId}-cntrl-cancel" tabindex="0">Cancel</button>
				</div>
			</div>
		</div>
	</div>
</div>