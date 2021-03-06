(function() {
	var b = YAHOO.util.Dom, q = YAHOO.util.Element, j = YAHOO.util.KeyListener, C = YAHOO.util.Event;
	Alfresco.constants.PAGEID = "documentlibrary";
	var r = Alfresco.util.encodeHTML;
	Alfresco.DNDUpload = function(D) {
		Alfresco.DNDUpload.superclass.constructor.call(this,"Alfresco.DNDUpload", D, [ "button", "container", "datatable", "datasource" ]);
		this.fileStore = {};
		this.addedFiles = {};
		this.defaultShowConfig = {
			files : [],
			siteId : null,
			containerId : null,
			destination : null,
			uploadDirectory : null,
			updateNodeRef : null,
			updateFilename : null,
			updateVersion : "1.0",
			mode : this.MODE_SINGLE_UPLOAD,
			filter : [],
			onFileUploadComplete : null,
			overwrite : false,
			thumbnails : null,
			uploadURL : null,
			username : null,
			suppressRefreshEvent : false,
			maximumFileSize : 0
		};
		this.suppliedConfig = {};
		this.showConfig = {};
		this.fileItemTemplates = {};
		if (typeof FormData !== "undefined") {
			this.uploadMethod = this.FORMDATA_UPLOAD
		} else {
			this.uploadMethod = this.INMEMORY_UPLOAD
		}
		return this
	};
	YAHOO.extend(
					Alfresco.DNDUpload,
					Alfresco.component.Base,
					{
						contentReady : false,
						FORMDATA_UPLOAD : 1,
						INMEMORY_UPLOAD : 2,
						uploadMethod : 2,
						STATE_BROWSING : 1,
						STATE_ADDED : 2,
						STATE_UPLOADING : 3,
						STATE_FINISHED : 4,
						STATE_FAILURE : 5,
						STATE_SUCCESS : 6,
						state : 1,
						fileStore : null,
						noOfSuccessfulUploads : 0,
						noOfFailedUploads : 0,
						aggregateUploadTargetSize : 0,
						aggregateUploadCurrentSize : 0,
						addedFiles : null,
						MODE_SINGLE_UPLOAD : 1,
						MODE_SINGLE_UPDATE : 2,
						MODE_MULTI_UPLOAD : 3,
						defaultShowConfig : null,
						suppliedConfig : null,
						showConfig : null,
						panel : null,
						dataTable : null,
						titleText : null,
						statusText : null,
						aggregateProgressText : null,
						aggregateDataWrapper : null,
						fileSelectionInput : null,
						minorVersion : null,
						description : null,
						versionSection : null,
						fileItemTemplates : null,
						_maximumFileSizeLimit : 0,
						setMaximumFileSizeLimit : function c(D) {
							this._maximumFileSizeLimit = D
						},
						getMaximumFileSizeLimit : function l() {
							return this._maximumFileSizeLimit
						},
						_inMemoryLimit : 250000000,
						metadataSection : null,
						m_tags : null,
						m_categories : null,
						setInMemoryLimit : function s(D) {
							if (isNaN(D)) {
								Alfresco.logger.warn('Non-numerical value set for "in-memory-limit" in share-documentlibrary.xml: ',D);
								this._inMemoryLimit = 25000000
							} else {
								this._inMemoryLimit = D
							}
						},
						getInMemoryLimit : function l() {
							return this._inMemoryLimit
						},
						onReady : function A() {
							b.removeClass(this.id + "-dialog", "hidden");
							this.panel = Alfresco.util.createYUIPanel(this.id + "-dialog");
							this.panel.hideEvent.subscribe(	this.onCancelOkButtonClick, null, this);
							this.fileItemTemplates.left = b.get(this.id	+ "-left-div");
							this.fileItemTemplates.center = b.get(this.id + "-center-div");
							this.fileItemTemplates.right = b.get(this.id + "-right-div");
							this._createEmptyDataTable();
							this.titleText = b.get(this.id + "-title-span");
							this.statusText = b.get(this.id + "-status-span");
							this.aggregateProgressText = b.get(this.id + "-aggregate-status-span");
							this.aggregateDataWrapper = b.get(this.id + "-aggregate-data-wrapper");
							this.description = b.get(this.id + "-description-textarea");
							this.minorVersion = b.get(this.id + "-minorVersion-radioButton");
							this.versionSection = b.get(this.id	+ "-versionSection-div");
							this.widgets.cancelOkButton = Alfresco.util.createYUIButton(this, "cancelOk-button",this.onCancelOkButtonClick);
							this.widgets.uploadButton = Alfresco.util.createYUIButton(this, "upload-button",this.onUploadButtonClick);
							this.metadataSection = b.get(this.id + "-metadata-table-container");
							this.m_tags = b.get(this.id + "-custom-tag-picker");
							this.m_categories = b.get(this.id + "-custom-category-picker");
							this.m_tagsCurrentValueDisplayDiv = b.get(this.id + "-custom-tag-picker-cntrl-currentValueDisplay");
							this.m_categoriesCurrentValueDisplayDiv = b.get(this.id + "-custom-category-picker-cntrl-currentValueDisplay");
							this.widgets.fileSelectionOverlayButton = Alfresco.util.createYUIButton(this,"file-selection-button-overlay",this._doNothing);
							b.addClass(this.widgets.fileSelectionOverlayButton._button,"dnd-file-selection-button-overlay");
							b.addClass(this.widgets.fileSelectionOverlayButton._button.parentNode,"dnd-file-selection-button-overlay-wrapper");
							this.widgets.escapeListener = new j(document, {	keys : j.KEY.ESCAPE  }, {
								fn : this.onCancelOkButtonClick,
								scope : this,
								correctScope : true
							})
						},
						_doNothing : function h() {
						},
						onFileSelection : function m(D) {
							var G = D.target.files;
							if (G != null) {
								this.showConfig.files = G;
								if (this.dataTable != null) {
									this.dataTable.set("height", "204px", true)
								}
								var E = true;
								for ( var F = 0; F < G.length; F++) {
									if (G[F].size !== 0) {
										E = false;
										break
									}
								}
								if (E) {
									this.processFilesForUpload(this.showConfig.files)
								} else {
									if (this.suppliedConfig.mode == this.MODE_SINGLE_UPDATE) {
										this.widgets.uploadButton.set("disabled", false);
										b.removeClass(this.widgets.uploadButton,"hidden")
									} else {
										b.removeClass(this.id + "-filelist-table", "hidden");
										b.removeClass(this.id + "-aggregate-data-wrapper", "hidden");
										b.addClass(this.id + "-file-selection-controls", "hidden");
										this.processFilesForUpload(this.showConfig.files)
									}
								}
							} else {
							}
						},
						show : function a(D) {
							var E = this;
							this.suppliedConfig = D;
							this.showConfig = YAHOO.lang.merge(
									this.defaultShowConfig, D);
							if (!this.showConfig.uploadDirectory
									&& !this.showConfig.updateNodeRef
									&& !this.showConfig.destination
									&& !this.showConfig.uploadURL) {
								throw new Error("An updateNodeRef, uploadDirectory, destination or uploadURL must be provided")
							}
							if (this.showConfig.uploadDirectory !== null
									&& this.showConfig.uploadDirectory.length === 0) {
								this.showConfig.uploadDirectory = "/"
							}
							this._resetGUI();
							this._applyConfig();
							if (this.showConfig.files == null || this.showConfig.files.length == 0) {
								b.removeClass(this.id + "-file-selection-controls", "hidden");
								b.addClass(this.id + "-filelist-table", "hidden");
								b.addClass(this.aggregateDataWrapper, "hidden");
								if (YAHOO.env.ua.ie > 9) {
									if (this.fileSelectionInput
											&& this.fileSelectionInput.parentNode) {
										this.fileSelectionInputParent = this.fileSelectionInput.parentNode;
										this.fileSelectionInput.parentNode
												.removeChild(this.fileSelectionInput)
									} else {
										this.fileSelectionInputParent = this.widgets.fileSelectionOverlayButton._button.parentNode;
										this.fileSelectionInputParent
												.removeChild(this.widgets.fileSelectionOverlayButton._button)
									}
									this.fileSelectionInput = document
											.createElement("input");
									b.setAttribute(this.fileSelectionInput,
											"type", "file");
									if (this.suppliedConfig.mode !== this.MODE_SINGLE_UPLOAD
											&& this.suppliedConfig.mode !== this.MODE_SINGLE_UPDATE) {
										b.setAttribute(this.fileSelectionInput,
												"multiple", "")
									}
									b.setAttribute(this.fileSelectionInput, "name", "files[]");
									b.addClass(this.fileSelectionInput,"ie10-dnd-file-selection-button");
									C.addListener(this.fileSelectionInput, "change", this.onFileSelection, this, true);
									this.fileSelectionInputParent.appendChild(this.fileSelectionInput)
								} else {
									if (this.fileSelectionInput	&& this.fileSelectionInput.parentNode) {
										this.fileSelectionInput.parentNode.removeChild(this.fileSelectionInput)
									}
									this.fileSelectionInput = document.createElement("input");
									b.setAttribute(this.fileSelectionInput,"type", "file");
									if (this.suppliedConfig.mode !== this.MODE_SINGLE_UPLOAD
											&& this.suppliedConfig.mode !== this.MODE_SINGLE_UPDATE) {
										b.setAttribute(this.fileSelectionInput,"multiple", "")
									}
									b.setAttribute(this.fileSelectionInput,	"name", "files[]");
									b.addClass(this.fileSelectionInput,"dnd-file-selection-button");
									C.addListener(this.fileSelectionInput,"change", this.onFileSelection,this, true);
									this.widgets.fileSelectionOverlayButton._button.parentNode.appendChild(this.fileSelectionInput)
								}
								this.widgets.escapeListener.enable();
								this.panel.setFirstLastFocusable();
								this.panel.show()
							} else {
								b.removeClass(this.id + "-filelist-table","hidden");
								b.removeClass(this.aggregateDataWrapper,"hidden");
								b.addClass(this.id + "-file-selection-controls","hidden");
								this.processFilesForUpload(this.showConfig.files)
							}
						},
						processFilesForUpload : function(D) {
							var F = 0, H = null, G = null, I;
							for ( var E = 0; E < D.length; E++) {
								F += D[E].size;
								I = D[E].name;
								H = this._getFileValidationErrors(D[E]);
								if (H) {
									if (G) {
										G += "<br/>" + H
									} else {
										G = H
									}
								}
							}
							this.aggregateUploadTargetSize = F;
							this._addFiles(0, D.length, this);
							if (G) {
								Alfresco.util.PopupManager.displayPrompt( {
									title : this.msg("header.error"),
									text : G,
									noEscape : true
								})
							}
						},
						_getFileValidationErrors : function(D) {
							var E = D.name;
							if (D.size === 0) {
								return this.msg("message.zeroByteFileSelected",
										E)
							} else {
								if (this._maximumFileSizeLimit > 0
										&& D.size > this._maximumFileSizeLimit) {
									return this.msg("message.maxFileFileSizeExceeded",r(E),Alfresco.util.formatFileSize(D.size),Alfresco.util.formatFileSize(this._maximumFileSizeLimit))
								} else {
									if (!Alfresco.forms.validation.nodeName( {
										id : "file",
										value : E
									}, null, null, null, true)) {
										return this.msg("message.illegalCharacters",r(E))
									}
								}
							}
							return null
						},
						_addFiles : function u(N, Q, T) {
							var P;
							if (N < Q) {
								var H = T.showConfig.files[N];
								if (!this._getFileValidationErrors(H)) {
									var F = "file" + N;
									try {
										var L = function R(Y) {
											Alfresco.logger.debug("File upload progress update received",Y);
											if (Y.lengthComputable) {
												try {
													var U = Math.round((Y.loaded * 100)	/ Y.total), W = T.fileStore[F];
													W.progressPercentage.innerHTML = U	+ "%";
													var X = (-400 + ((U / 100) * 400));
													b.setStyle(W.progress,"left", X + "px");
													T._updateAggregateProgress(W, Y.loaded);
													W.lastProgress = Y.loaded
												} catch (V) {
													Alfresco.logger.error("The following error occurred processing an upload progress event: ",V)
												}
											} else {
												Alfresco.logger.debug("File upload progress not computable",Y)
											}
										};
										var O = function G(X) {
											try {
												Alfresco.logger
														.debug(
																"File upload completion notification received",
																X);
												var V = T.fileStore[F];
												if (V.request.readyState != 4) {
													V.request.onreadystatechange = function W() {
														if (V.request.readyState == 4) {
															T._processUploadCompletion(V)
														}
													}
												} else {
													T._processUploadCompletion(V)
												}
											} catch (U) {
												Alfresco.logger.error("The following error occurred processing an upload completion event: ",U)
											}
										};
										var M = function S(W) {
											try {
												var V = T.fileStore[F];
												if (V.state !== T.STATE_FAILURE) {
													T._processUploadFailure(V,
															W.status)
												}
											} catch (U) {
												Alfresco.logger.error("The following error occurred processing an upload failure event: ",U)
											}
										};
										var K = H.name;
										var J = new XMLHttpRequest();
										J.upload._fileData = F;
										J.upload.addEventListener("progress",L, false);
										J.upload.addEventListener("load", O,false);
										J.upload.addEventListener("error", M,false);
										data = {
											id : F,
											name : K,
											size : T.showConfig.files[N].size
										};
										var I = null;
										if (T.suppliedConfig && T.suppliedConfig.updateNodeRef) {
											I = T.suppliedConfig.updateNodeRef
										}
										var D = {
											filedata : T.showConfig.files[N],
											filename : K,
											destination : T.showConfig.destination,
											siteId : T.showConfig.siteId,
											containerId : T.showConfig.containerId,
											uploaddirectory : T.showConfig.uploadDirectory,
											majorVersion : !T.minorVersion.checked,
											updateNodeRef : I,
											description : T.description.value,
											overwrite : T.showConfig.overwrite,
											thumbnails : T.showConfig.thumbnails,
											username : T.showConfig.username
										};
										T.fileStore[F] = {
											state : T.STATE_ADDED,
											fileName : K,
											nodeRef : I,
											uploadData : D,
											request : J
										};
										T.dataTable.addRow(data);
										T.addedFiles[P] = T
												._getUniqueFileToken(data);
										T.widgets.escapeListener.enable();
										T.panel.setFirstLastFocusable();
										T.panel.show()
									} catch (E) {
										Alfresco.logger.error("DNDUpload_show: The following exception occurred processing a file to upload: ",														E)
									}
								}
								T._addFiles(N + 1, Q, T)
							}
						},
						_processUploadCompletion : function i(E) {
							if (E.request.status == "200") {
								var D = Alfresco.util.parseJSON(E.request.responseText);
								E.nodeRef = D.nodeRef;
								E.fileName = D.fileName;
								E.state = this.STATE_SUCCESS;
								b.addClass(E.progressStatusIncomplete,"hidden");
								b.removeClass(E.progressStatusComplete,	"hidden");
								b.removeClass(E.progress,"fileupload-progressSuccess-span");
								b.addClass(E.progress,"fileupload-progressFinished-span");
								b.setStyle(E.progress, "left", 0 + "px");
								E.progressPercentage.innerHTML = "100%";
								this.noOfSuccessfulUploads++;
								this._updateAggregateProgress(E,E.uploadData.filedata.size);
								this._updateStatus();
								this._adjustGuiIfFinished();
								this._spawnUploads()
							} else {
								this._processUploadFailure(E, E.request.status)
							}
						},
						_processUploadFailure : function v(G, D) {
							G.state = this.STATE_FAILURE;
							var I = G.request.status + " "
									+ G.request.statusText;
							try {
								I = JSON.parse(G.request.responseText).message;
								I = I.substring(I.indexOf(" ") + 1)
							} catch (F) {
								Alfresco.logger.error("The following error occurred parsing the upload failure message for " + I + ": " + F)
							}
							var E = "label.failure." + D, H = Alfresco.util.message(E, this.name);
							if (H == E) {
								H = Alfresco.util.message("label.failure",this.name, I)
							}
							G.fileSizeInfo.innerHTML = G.fileSizeInfo.innerHTML	+ " (" + H + ")";
							G.fileSizeInfo.setAttribute("title", H);
							G.progressInfo.setAttribute("title", H);
							G.progressInfo.parentElement.setAttribute("title",H);
							b.addClass(G.progressStatusIncomplete, "hidden");
							b.removeClass(G.progressStatusFailed, "hidden");
							b.removeClass(G.progress,"fileupload-progressSuccess-span");
							b.addClass(G.progress,"fileupload-progressFailure-span");
							b.setStyle(G.progress, "left", 0 + "px");
							this._updateAggregateProgress(G,G.uploadData.filedata.size);
							this.noOfFailedUploads++;
							this._updateStatus();
							this._adjustGuiIfFinished();
							this._spawnUploads()
						},
						_updateAggregateProgress : function w(F, E) {
							this.aggregateUploadCurrentSize -= F.lastProgress;
							this.aggregateUploadCurrentSize += E;
							var D = (this.aggregateUploadCurrentSize / this.aggregateUploadTargetSize);
							var G = (-620 + (D * 620));
							b.setStyle(this.id + "-aggregate-progress-span","left", G + "px")
						},
						_resetGUI : function x() {
							if (this.statusText == null) {
								this.onReady()
							}
							this.state = this.STATE_UPLOADING;
							this.noOfFailedUploads = 0;
							this.noOfSuccessfulUploads = 0;
							this.statusText.innerHTML = "&nbsp;";
							this.description.value = "";
							this.minorVersion.checked = true;
							this.widgets.cancelOkButton.set("label", this
									.msg("button.cancel"));
							this.widgets.cancelOkButton.set("disabled", false);
							this.widgets.uploadButton.set("label", this
									.msg("button.upload"));
							this.widgets.uploadButton.set("disabled", false);
							this.aggregateUploadTargetSize = 0;
							this.aggregateUploadCurrentSize = 0;
							b.setStyle(this.id + "-aggregate-progress-span",
									"left", "-620px");
							b.removeClass(this.aggregateDataWrapper, "hidden");
							if (this.m_tags != null) {
								this.m_tags.value = ""
							}
							if (this.m_categories != null) {
								this.m_categories.value = ""
							}
							if (this.m_tagsCurrentValueDisplayDiv != null) {
								this.m_tagsCurrentValueDisplayDiv.innerHTML = ""
							}
							if (this.m_categoriesCurrentValueDisplayDiv != null) {
								this.m_categoriesCurrentValueDisplayDiv.innerHTML = ""
							}
						},
						onPostRenderEvent : function o(D) {
							if (this.dataTable.getRecordSet().getLength() > 0) {
								this.panel.setFirstLastFocusable();
								this.panel.focusFirst()
							}
						},
						onRowAddEvent : function z(G) {
							try {
								var D = Alfresco.constants.PROXY_URI
										+ "api/upload";
								var H = G.record.getData();
								var F = this.fileStore[H.id];
								F.lastProgress = 0;
								this._updateAggregateStatus()
							} catch (E) {
								Alfresco.logger
										.error("The following error occurred initiating upload: "
												+ E)
							}
						},
						_spawnUploads : function() {
							var H = this.dataTable.getRecordSet().getLength();
							for ( var G = 0; G < H; G++) {
								var E = this.dataTable.getRecordSet()
										.getRecord(G);
								var D = E.getData("id");
								var F = this.fileStore[D];
								if (F.state == this.STATE_ADDED) {
									this._startUpload(F);
									return
								}
							}
						},
						_startUpload : function(E) {
							E.state = this.STATE_UPLOADING;
							var D;
							if (this.showConfig.uploadURL === null) {
								D = Alfresco.constants.PROXY_URI + "api/upload"
							} else {
								D = Alfresco.constants.PROXY_URI
										+ this.showConfig.uploadURL
							}
							if (Alfresco.util.CSRFPolicy.isFilterEnabled()) {
								D += "?"
										+ Alfresco.util.CSRFPolicy
												.getParameter()
										+ "="
										+ encodeURIComponent(Alfresco.util.CSRFPolicy
												.getToken())
							}
							if (this.uploadMethod === this.FORMDATA_UPLOAD) {
								Alfresco.logger.debug("Using FormData for file upload");
								var I = new FormData;
								I.append("filedata", E.uploadData.filedata);
								I.append("filename", E.uploadData.filename);
								I.append("destination",E.uploadData.destination);
								I.append("siteId", E.uploadData.siteId);
								I.append("containerId",E.uploadData.containerId);
								I.append("uploaddirectory",E.uploadData.uploaddirectory);
								I.append("majorVersion",E.uploadData.majorVersion ? "true": "false");
								I.append("username", E.uploadData.username);
								I.append("overwrite", E.uploadData.overwrite);
								I.append("thumbnails", E.uploadData.thumbnails);
								if (Alfresco.constants.PAGEID == "documentlibrary") {
									I.append("prop_cm_taggable",this.m_tags.value);
									I.append("prop_cm_categories",this.m_categories.value)
								}
								if (E.uploadData.updateNodeRef) {
									I.append("updateNodeRef",E.uploadData.updateNodeRef)
								}
								if (E.uploadData.description) {
									I.append("description",
											E.uploadData.description)
								}
								E.request.open("POST", D, true);
								E.request.send(I)
							} else {
								if (this.uploadMethod === this.INMEMORY_UPLOAD) {
									Alfresco.logger.debug("Using custom multipart upload");
									var F = "----AlfrescoCustomMultipartBoundary" + (new Date).getTime();
									var H = "\r\n";
									var G = "--" + F;
									G += H 	+ 'Content-Disposition: form-data; name="filedata"; filename="'
											+ unescape(encodeURIComponent(E.uploadData.filename))
											+ '"';
									G += H + "Content-Type: image/png";
									G += H + H + E.uploadData.filedata.getAsBinary() + H + "--" + F;
									G += H + 'Content-Disposition: form-data; name="filename"';
									G += H + H + unescape(encodeURIComponent(E.uploadData.filename))
											+ H + "--" + F;
									G += H 	+ 'Content-Disposition: form-data; name="destination"';
									if (E.uploadData.destination !== null) {
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.destination))
												+ H + "--" + F
									} else {
										G += H + H + H + "--" + F
									}
									G += H
											+ 'Content-Disposition: form-data; name="siteId"';
									G += H
											+ H
											+ unescape(encodeURIComponent(E.uploadData.siteId))
											+ H + "--" + F;
									G += H
											+ 'Content-Disposition: form-data; name="containerId"';
									G += H
											+ H
											+ unescape(encodeURIComponent(E.uploadData.containerId))
											+ H + "--" + F;
									G += H
											+ 'Content-Disposition: form-data; name="uploaddirectory"';
									G += H
											+ H
											+ unescape(encodeURIComponent(E.uploadData.uploaddirectory))
											+ H + "--" + F + "--";
									if (Alfresco.constants.PAGEID == "documentlibrary") {
										G += H	+ 'Content-Disposition: form-data; name="prop_cm_taggable"';
										G += H	+ H	+ unescape(encodeURIComponent(scope.m_tags.value))
												+ H + "--" + F + "--";
										G += H	+ 'Content-Disposition: form-data; name="prop_cm_categories"';
										G += H	+ H
												+ unescape(encodeURIComponent(scope.m_categories.value))
												+ H + "--" + F + "--"
									}
									G += H
											+ 'Content-Disposition: form-data; name="majorVersion"';
									G += H
											+ H
											+ unescape(encodeURIComponent(E.uploadData.majorVersion))
											+ H + "--" + F + "--";
									if (E.uploadData.updateNodeRef) {
										G += H
												+ 'Content-Disposition: form-data; name="updateNodeRef"';
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.updateNodeRef))
												+ H + "--" + F + "--"
									}
									if (E.uploadData.description) {
										G += H
												+ 'Content-Disposition: form-data; name="description"';
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.description))
												+ H + "--" + F + "--"
									}
									if (E.uploadData.username) {
										G += H
												+ 'Content-Disposition: form-data; name="username"';
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.username))
												+ H + "--" + F + "--"
									}
									if (E.uploadData.overwrite) {
										G += H
												+ 'Content-Disposition: form-data; name="overwrite"';
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.overwrite))
												+ H + "--" + F + "--"
									}
									if (E.uploadData.thumbnails) {
										G += H
												+ 'Content-Disposition: form-data; name="thumbnails"';
										G += H
												+ H
												+ unescape(encodeURIComponent(E.uploadData.thumbnails))
												+ H + "--" + F + "--"
									}
									E.request.open("POST", D, true);
									E.request.setRequestHeader("Content-Type",
											"multipart/form-data; boundary="
													+ F);
									E.request.sendAsBinary(G)
								}
							}
						},
						onUploadButtonClick : function k() {
							this.state = this.STATE_UPLOADING;
							b
									.removeClass(this.id + "-filelist-table",
											"hidden");
							b.removeClass(this.id + "-aggregate-data-wrapper",
									"hidden");
							b.addClass(this.id + "-file-selection-controls",
									"hidden");
							b.addClass(this.versionSection, "hidden");
							this.widgets.uploadButton.set("disabled", true);
							this._spawnUploads()
						},
						onCancelOkButtonClick : function B() {
							var F, E;
							if (this.state === this.STATE_UPLOADING) {
								this._cancelAllUploads();
								var D = 0;
								for (E in this.fileStore) {
									if (this.fileStore[E]
											&& this.fileStore[E].state === this.STATE_SUCCESS) {
										D++
									}
								}
								if (D > 0) {
									F = YAHOO.lang.substitute(this
											.msg("message.cancelStatus"), {
										"0" : D
									})
								}
								if (!this.showConfig.suppressRefreshEvent) {
									YAHOO.Bubbling.fire("metadataRefresh", {
										currentPath : this.showConfig.path
									})
								}
							} else {
								if (this.state === this.STATE_FINISHED) {
									var H = null, G;
									for (E in this.fileStore) {
										G = this.fileStore[E];
										if (G && G.state === this.STATE_SUCCESS) {
											H = G.fileName;
											break
										}
									}
									if (!this.showConfig.suppressRefreshEvent) {
										if (H) {
											YAHOO.Bubbling
													.fire(
															"metadataRefresh",
															{
																currentPath : this.showConfig.path,
																highlightFile : H
															})
										} else {
											YAHOO.Bubbling
													.fire(
															"metadataRefresh",
															{
																currentPath : this.showConfig.path
															})
										}
									}
								}
							}
							this._clear();
							this.panel.hide();
							this.widgets.escapeListener.disable();
							if (F) {
								Alfresco.util.PopupManager.displayPrompt( {
									text : F
								})
							}
						},
						_applyConfig : function g() {
							var I, G;
							if (this.showConfig.mode === this.MODE_SINGLE_UPLOAD) {
								G = this.msg("header.singleUpload");
								this.titleText.innerHTML = G
							} else {
								if (this.showConfig.mode === this.MODE_MULTI_UPLOAD) {
									G = this.showConfig.files.length == 1 ? "header.multiUpload.singleFile"
											: "header.multiUpload";
									var F = this.showConfig.uploadDirectoryName == "" ? this
											.msg("label.documents")
											: this.showConfig.uploadDirectoryName;
									this.titleText.innerHTML = this
											.msg(
													G,
													'<img src="'
															+ Alfresco.constants.URL_RESCONTEXT
															+ 'components/documentlibrary/images/folder-open-16.png" class="title-folder" />'
															+ r(F))
								} else {
									if (this.showConfig.mode === this.MODE_SINGLE_UPDATE) {
										G = this.msg("header.singleUpdate");
										this.titleText.innerHTML = G
									}
								}
							}
							if (this.showConfig.mode === this.MODE_SINGLE_UPDATE) {
								b.removeClass(this.versionSection, "hidden");
								var E = (this.showConfig.updateVersion || "1.0")
										.split("."), D = parseInt(E[0], 10), H = parseInt(
										E[1], 10);
								b.get(this.id + "-minorVersion").innerHTML = this
										.msg("label.minorVersion.more", D + "."
												+ (1 + H));
								b.get(this.id + "-majorVersion").innerHTML = this
										.msg("label.majorVersion.more", (1 + D)
												+ ".0")
							} else {
								b.addClass(this.versionSection, "hidden")
							}
							if (this.showConfig.mode === this.MODE_MULTI_UPLOAD) {
								b.removeClass(this.statusText, "hidden");
								this.dataTable.set("height", "204px", true)
							} else {
								b.addClass(this.statusText, "hidden");
								this.dataTable.set("height", "40px")
							}
						},
						_createEmptyDataTable : function t() {
							var D = this;
							var E = function(L, M, N, O) {
								try {
									D._formatCellElements(L, M,
											D.fileItemTemplates.left)
								} catch (K) {
									Alfresco.logger
											.error(
													"DNDUpload__createEmptyDataTable (formatLeftCell): The following error occurred: ",
													K)
								}
							};
							var J = function(L, M, N, O) {
								try {
									D._formatCellElements(L, M,
											D.fileItemTemplates.center)
								} catch (K) {
									Alfresco.logger
											.error(
													"DNDUpload__createEmptyDataTable (formatCenterCell): The following error occurred: ",
													K)
								}
							};
							var H = function(L, M, N, O) {
								try {
									D._formatCellElements(L, M,
											D.fileItemTemplates.right)
								} catch (K) {
									Alfresco.logger
											.error(
													"DNDUpload__createEmptyDataTable (formatRightCell): The following error occurred: ",
													K)
								}
							};
							this._formatCellElements = function(L, X, V) {
								var S = X.getData(), N = S.id;
								var W = new q(L);
								var P = V.cloneNode(true);
								P.setAttribute("id", P.getAttribute("id") + N);
								var K = b.getElementsByClassName(
										"fileupload-progressSuccess-span",
										"span", P);
								if (K.length == 1) {
									this.fileStore[N].progress = K[0]
								}
								var T = b.getElementsByClassName(
										"fileupload-progressInfo-span", "span",
										P);
								if (T.length == 1) {
									var M = S.name;
									P.setAttribute("title", M);
									T = T[0];
									this.fileStore[N].progressInfo = T;
									this.fileStore[N].progressInfo.innerHTML = M;
									this.fileStore[N].progressInfoCell = L
								}
								var O = b.getElementsByClassName(
										"fileupload-filesize-span", "span", P);
								if (O.length == 1) {
									var M = Alfresco.util
											.formatFileSize(S.size);
									O = O[0];
									this.fileStore[N].fileSizeInfo = O;
									O.innerHTML = M
								}
								var U = b.getElementsByClassName(
										"fileupload-contentType-select",
										"select", P);
								if (U.length == 1) {
									this.fileStore[N].contentType = U[0]
								} else {
									U = b.getElementsByClassName(
											"fileupload-contentType-input",
											"input", P);
									if (U.length == 1) {
										this.fileStore[N].contentType = U[0]
									}
								}
								var R = b
										.getElementsByClassName(
												"fileupload-percentage-span",
												"span", P);
								if (R.length == 1) {
									this.fileStore[N].progressPercentage = R[0]
								}
								var Q = b.getElementsByClassName(
										"fileupload-status-img", "img", P);
								if (Q.length == 3) {
									this.fileStore[N].progressStatusIncomplete = Q[0];
									this.fileStore[N].progressStatusComplete = Q[1];
									this.fileStore[N].progressStatusFailed = Q[2]
								}
								W.appendChild(P)
							};
							var I = [ {
								key : "id",
								className : "col-left",
								resizable : false,
								formatter : E
							}, {
								key : "name",
								className : "col-center",
								resizable : false,
								formatter : J
							}, {
								key : "created",
								className : "col-right",
								resizable : false,
								formatter : H
							} ];
							var G = new YAHOO.util.DataSource(
									[],
									{
										responseType : YAHOO.util.DataSource.TYPE_JSARRAY
									});
							YAHOO.widget.DataTable._bStylesheetFallback = !!YAHOO.env.ua.ie;
							var F = b.get(this.id + "-filelist-table");
							this.dataTable = new YAHOO.widget.DataTable(F, I,
									G, {
										scrollable : true,
										height : "100px",
										width : "620px",
										renderLoopSize : 1,
										MSG_EMPTY : this.msg("label.noFiles")
									});
							this.dataTable.subscribe("postRenderEvent",
									this.onPostRenderEvent, this, true);
							this.dataTable.subscribe("rowAddEvent",
									this.onRowAddEvent, this, true)
						},
						_getUniqueFileToken : function f(D) {
							return D.name + ":" + D.size
						},
						_updateStatus : function d() {
							if (this.noOfFailedUploads > 0) {
								this.statusText.innerHTML = YAHOO.lang
										.substitute(
												this
														.msg("label.uploadStatus.withFailures"),
												{
													"0" : this.noOfSuccessfulUploads,
													"1" : this.dataTable
															.getRecordSet()
															.getLength(),
													"2" : this.noOfFailedUploads
												})
							} else {
								this.statusText.innerHTML = YAHOO.lang
										.substitute(this
												.msg("label.uploadStatus"), {
											"0" : this.noOfSuccessfulUploads,
											"1" : this.dataTable.getRecordSet()
													.getLength()
										})
							}
						},
						_updateAggregateStatus : function p() {
							this.aggregateProgressText.innerHTML = YAHOO.lang
									.substitute(
											this
													.msg("label.aggregateUploadStatus"),
											{
												"0" : this.dataTable
														.getRecordSet()
														.getLength(),
												"1" : Alfresco.util
														.formatFileSize(this.aggregateUploadTargetSize)
											})
						},
						_adjustGuiIfFinished : function e() {
							try {
								var G = {
									successful : [],
									failed : []
								};
								var F = null;
								for ( var E in this.fileStore) {
									F = this.fileStore[E];
									if (F) {
										if (F.state == this.STATE_SUCCESS) {
											G.successful.push( {
												fileName : F.fileName,
												nodeRef : F.nodeRef
											})
										} else {
											if (F.state == this.STATE_FAILURE) {
												G.failed.push( {
													fileName : F.fileName
												})
											} else {
												return
											}
										}
									}
								}
								this.state = this.STATE_FINISHED;
								b.addClass(this.aggregateDataWrapper, "hidden");
								this.widgets.uploadButton.set("label", this
										.msg("button.ok"));
								this.widgets.uploadButton.focus();
								this.widgets.cancelOkButton.set("label", this
										.msg("button.ok"));
								this.widgets.cancelOkButton.focus();
								var H = this.showConfig.onFileUploadComplete;
								if (H && typeof H.fn == "function") {
									H.fn
											.call(
													(typeof H.scope == "object" ? H.scope
															: this), G, H.obj)
								}
								if (G.failed.length === 0) {
									this.onCancelOkButtonClick()
								}
							} catch (D) {
								Alfresco.logger
										.error("_adjustGuiIfFinished", D)
							}
						},
						_cancelAllUploads : function n() {
							var H = this.dataTable.getRecordSet().getLength();
							for ( var G = 0; G < H; G++) {
								var E = this.dataTable.getRecordSet()
										.getRecord(G);
								var D = E.getData("id");
								var F = this.fileStore[D];
								if (F.state === this.STATE_UPLOADING) {
									Alfresco.logger.debug("Aborting upload of file: "
													+ F.fileName);
									F.request.abort()
								}
							}
						},
						_clear : function y() {
							var D = this.dataTable.getRecordSet().getLength();
							this.addedFiles = {};
							this.fileStore = {};
							this.dataTable.deleteRows(0, D)
						}
					})
})();