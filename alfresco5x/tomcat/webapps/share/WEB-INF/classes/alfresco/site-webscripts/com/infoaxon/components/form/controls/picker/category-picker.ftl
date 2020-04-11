<#assign categoryPickerId = (args.htmlid?html) + "-custom-category-picker">

<script type="text/javascript">//<![CDATA[
(function()
{
   var picker = new Alfresco.ObjectFinder("${categoryPickerId}-cntrl", "${categoryPickerId}").setOptions(
   {
      field: "prop_cm_categories",
      compactMode: true,
      mandatory: false,
      currentValue: "",      
      selectActionLabel: "Select",
      minSearchTermLength: 1,
      maxSearchResults: 1000      
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
      params: "",
      createNewItemUri: "",
      createNewItemIcon: ""
   });
})();
//]]></script>

<div class="form-field inlineable">	     
	<div id="${categoryPickerId}-cntrl" class="object-finder inlineable">         
		<div id="${categoryPickerId}-cntrl-currentValueDisplay" class="current-values inlineable">
		</div>         
        <input type="hidden" id="${categoryPickerId}" name="prop_cm_categories" value="" />
		<div id="${categoryPickerId}-cntrl-itemGroupActions" class="show-picker inlineable">
		</div>         
		<div id="${categoryPickerId}-cntrl-picker" class="picker yui-panel">
			<div id="${categoryPickerId}-cntrl-picker-head" class="hd">
				Select...
			</div>
			<div id="${categoryPickerId}-cntrl-picker-body" class="bd">
				<div class="picker-header">
					<div id="${categoryPickerId}-cntrl-picker-folderUpContainer" class="folder-up" style="display:none">
						<button id="${categoryPickerId}-cntrl-picker-folderUp"></button>
					</div>
					<div id="${categoryPickerId}-cntrl-picker-navigatorContainer" class="navigator">
						<button id="${categoryPickerId}-cntrl-picker-navigator"></button>
						<div id="${categoryPickerId}-cntrl-picker-navigatorMenu" class="yuimenu">
							<div class="bd">
								<ul id="${categoryPickerId}-cntrl-picker-navigatorItems" class="navigator-items-list">
									<li>&nbsp;</li>
								</ul>
							</div>
						</div>
					</div>
					<div id="${categoryPickerId}-cntrl-picker-searchContainer" class="search">
						<input type="text" class="search-input" name="-" id="${categoryPickerId}-cntrl-picker-searchText" value="" maxlength="256" />
						<span class="search-button"><button id="${categoryPickerId}-cntrl-picker-searchButton">Search</button></span>
					</div>
				</div>
				<div class="yui-g">
					<div id="${categoryPickerId}-cntrl-picker-left" class="yui-u first panel-left">
						<div id="${categoryPickerId}-cntrl-picker-results" class="picker-items">
						</div>
					</div>
					<div id="${categoryPickerId}-cntrl-picker-right" class="yui-u panel-right">
						<div id="${categoryPickerId}-cntrl-picker-selectedItems" class="picker-items">
						</div>
					</div>
				</div>
				<div class="bdft">
					<button id="${categoryPickerId}-cntrl-ok" tabindex="0">OK</button>
					<button id="${categoryPickerId}-cntrl-cancel" tabindex="0">Cancel</button>
				</div>
			</div>
		</div>
	</div>
</div>
