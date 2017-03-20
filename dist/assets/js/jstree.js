/**
* markdown - Script that will transform your notes taken in the Markdown format (.md files) into a rich website
* @version   : 1.0.5
* @author    : christophe@aesecure.com
* @license   : MIT
* @url       : https://github.com/cavo789/markdown
* @package   : 2017-03-20T21:07:15.859Z
*/
function jsTree_ajax_search(e,t){return $.inArray(t.id,jsTree_Search_Result)>=0}function jstree_init(e){try{$.isFunction($.fn.jstree)&&($("#TOC").jstree("destroy").empty(),$("#TOC").jstree("true"),$("#TOC").on("changed.jstree",function(e,t){var a=t.instance.get_node(t.selected);if("undefined"!=typeof a.parent){var n=a.parent+a.text+".md";n=window.btoa(encodeURIComponent(JSON.stringify(n))),ajaxify({task:a.data.task,param:n,callback:"afterDisplay($data.param)",target:"CONTENT",useStore:!1})}}).on("click",".jstree-anchor",function(e){$(this).jstree(!0).toggle_node(e.target)}).on("keydown.jstree",".jstree-anchor",function(e){var t=$("#TOC").jstree(!0).get_node(e.currentTarget);t.data&&console.log("changed.jstree - "+t.data.file)}).on("create_node.jstree",function(e,t){jstree_create_node(e,t)}).on("rename_node.jstree",function(e,t){jstree_rename_node(e,t)}).on("delete_node.jstree",function(e,t){jstree_remove_node(e,t)}).on("search.jstree",function(e,t,a){0===t.nodes.length&&($("#TOC").jstree(!0).hide_all(),$("#TOC").jstree("show_node","ul > li:first"))}).jstree({core:{animation:1,data:e.tree,check_callback:function(e,t,a,n,r){return"move_node"!==e},multiple:!1,initially_open:["phtml_1"],sort:function(e,t){return this.get_type(e)===this.get_type(t)?this.get_text(e)>this.get_text(t)?1:-1:this.get_type(e)>=this.get_type(t)?1:-1},themes:{responsive:1,variant:"small",stripes:1},types:{default:{icon:"folder"},file:{icon:"file file-md"},folder:{icon:"folder"}}},plugins:["contextmenu","state","dnd","search","types","unique","wholerow"],search:{case_insensitive:!0,show_only_matches:!0,search_leaves_only:!0,ajax:{url:"index.php?task=search",dataType:"json",type:"POST",success:function(e){jsTree_Search_Result=e}},search_callback:jsTree_ajax_search},contextmenu:{items:jstree_context_menu}}))}catch(e){console.warn(e.message)}}function jstree_context_menu(e){var t=$("#TOC").jstree(!0),a={Add_Folder:{separator_before:!1,separator_after:!1,label:markdown.message.tree_new_folder,icon:"fa fa-folder-open-o",action:function(){var a=t.create_node(e,{text:markdown.message.tree_new_folder_name,icon:"folder"});t.edit(a)}},Add_Item:{separator_before:!1,separator_after:!1,label:markdown.message.tree_new_note,icon:"fa fa-file-text-o",action:function(){var a=t.create_node("folder"===e.icon?e:e.parent,{text:markdown.message.tree_new_note_name,icon:"file file-md",data:{task:"display"}});t.edit(a)}},Rename:{separator_before:!1,separator_after:!1,label:markdown.message.tree_rename,icon:"fa fa-pencil",action:function(){t.edit(e)}},Remove:{separator_before:!0,separator_after:!1,label:"folder"===e.icon?markdown.message.tree_delete_folder.replace("%s",e.text):markdown.message.tree_delete_file.replace("%s",e.text),icon:"fa fa-trash",action:function(){noty({theme:"relax",timeout:0,layout:"center",type:"warning",text:"<strong>"+("folder"===e.icon?markdown.message.tree_delete_folder_confirm.replace("%s",e.text):markdown.message.tree_delete_file_confirm.replace("%s",e.text))+"</strong>",buttons:[{addClass:"btn btn-primary",text:markdown.message.ok,onClick:function(a){a.close(),t.delete_node(e)}},{addClass:"btn btn-danger",text:markdown.message.cancel,onClick:function(e){e.close()}}]})}}};return"folder"!==e.icon&&delete a.Add_Folder,a}function jstree_create_node(e,t){}function jstree_CRUD_node(e,t,a){try{var n="folder"===t.node.icon?"folder":"file",r="",o="";if("folder"===n)r=t.node.parent+t.old,o=t.node.parent+t.node.text;else{var s=$("#TOC").jstree(!0).get_node(t.node.parent);r=s.parent+s.text+markdown.settings.DS+t.old,o=s.parent+s.text+markdown.settings.DS+t.node.text}r=window.btoa(encodeURIComponent(JSON.stringify(r))),o=window.btoa(encodeURIComponent(JSON.stringify(o))),"rename"!==a?ajaxify({task:a,param:o,param3:n,callback:"jstree_show_status(data)"}):ajaxify({task:a,param:r,param2:o,param3:n,callback:"jstree_show_status(data)"})}catch(e){console.warn(e.message)}}function jstree_show_status(e){console.log("jstree_show_status"),console.log(e),e.hasOwnProperty("status")&&($status=e.status,1==$status?(Noty({message:e.msg,type:"success"}),"folder"!==e.type||"rename"!==e.action&&"create"!==e.action||($("#TOC li").each(function(){$("#TOC").jstree().disable_node(this.id)}),ajaxify({task:"listFiles",callback:"initFiles(data)",useStore:!1}),Noty({message:markdown.message.loading_tree,type:"info"}))):Noty({message:e.msg,type:"error"}))}function jstree_rename_node(e,t){jstree_CRUD_node(e,t,"rename")}function jstree_remove_node(e,t){jstree_CRUD_node(e,t,"delete")}var jsTree_Search_Result="";