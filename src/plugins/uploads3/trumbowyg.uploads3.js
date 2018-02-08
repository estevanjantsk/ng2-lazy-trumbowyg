/* ===========================================================
 * trumbowyg.upload.js v1.0
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Estevan Jantsk (estevanjantsk)
 *          Twitter : @estevanjantsk
 */

(function (window) {
    'use strict';
    window.onload = function() {
        var $ = window.$;
    
        var defaultOptions = {
            getS3KeyURL: '',
            serverPath: '',
            fileFieldName: 'fileToUpload',
            data: [],                       // Additional data for ajax [{name: 'key', value: 'value'}]
            headers: {},                    // Additional headers
            xhrFields: {},                  // Additional fields
            urlPropertyName: 'file',        // How to get url from the json response (for instance 'url' for {url: ....})
            statusPropertyName: 'success',  // How to get status from the json response 
            success: undefined,             // Success callback: function (data, trumbowyg, $modal, values) {}
            error: undefined,               // Error callback: function () {}
            imageWidthModalEdit: false      // Add ability to edit image width
        };
    
        function getDeep(object, propertyParts) {
            var mainProperty = propertyParts.shift(),
                otherProperties = propertyParts;
    
            if (object !== null) {
                if (otherProperties.length === 0) {
                    return object[mainProperty];
                }
    
                if (typeof object === 'object') {
                    return getDeep(object[mainProperty], otherProperties);
                }
            }
            return object;
        }
    
        addXhrProgressEvent();
    
        $.extend(true, $.trumbowyg, {
            langs: {
                // jshint camelcase:false
                en: {
                    upload: 'Upload',
                    file: 'File',
                    uploadError: 'Error'
                },
                sk: {
                    upload: 'Nahrať',
                    file: 'Súbor',
                    uploadError: 'Chyba'
                },
                fr: {
                    upload: 'Envoi',
                    file: 'Fichier',
                    uploadError: 'Erreur'
                },
                cs: {
                    upload: 'Nahrát obrázek',
                    file: 'Soubor',
                    uploadError: 'Chyba'
                },
                zh_cn: {
                    upload: '上传',
                    file: '文件',
                    uploadError: '错误'
                },
                zh_tw: {
                    upload: '上傳',
                    file: '文件',
                    uploadError: '錯誤'
                },            
                ru: {
                    upload: 'Загрузка',
                    file: 'Файл',
                    uploadError: 'Ошибка'
                },
                ja: {
                    upload: 'アップロード',
                    file: 'ファイル',
                    uploadError: 'エラー'
                },
                pt_br: {
                    upload: 'Enviar do local',
                    file: 'Arquivo',
                    uploadError: 'Erro'
                },
                tr: {
                    upload: 'Yükle',
                    file: 'Dosya',
                    uploadError: 'Hata'
                }
            },
            // jshint camelcase:true
    
            plugins: {
                upload: {
                    init: function (trumbowyg) {
                        trumbowyg.o.plugins.upload = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.upload || {});
                        var btnDef = {
                            fn: function () {
                                trumbowyg.saveRange();
    
                                var file,
                                    prefix = trumbowyg.o.prefix;
    
                                var fields = {
                                    file: {
                                        type: 'file',
                                        required: true,
                                        attributes: {
                                            accept: 'image/*'
                                        }
                                    },
                                    alt: {
                                        label: 'description',
                                        value: trumbowyg.getRangeText()
                                    }
                                };
    
                                if (trumbowyg.o.plugins.upload.imageWidthModalEdit) {
                                    fields.width = {
                                        value: ''
                                    };
                                }
    
                                var $modal = trumbowyg.openModalInsert(
                                    // Title
                                    trumbowyg.lang.upload,
    
                                    // Fields
                                    fields,
    
                                    // Callback
                                    function (values) {

                                        // Get getS3KeyURL 
                                        $.get( trumbowyg.o.plugins.upload.getS3KeyURL, function(res) {
                                            const S3 = res.form_data;
                                            let templateFormData = new FormData();
                                            templateFormData.append('key', S3.key + '/' + file.name);
                                            templateFormData.append('AWSAccessKeyId', S3.AWSAccessKeyId);
                                            templateFormData.append('acl', S3.acl);
                                            templateFormData.append('policy', S3.policy);
                                            templateFormData.append('signature', S3.signature);
                                            templateFormData.append('success_action_status', S3.success_action_status);
                                            templateFormData.append('file', file);

                                            if ($('.' + prefix + 'progress', $modal).length === 0) {
                                                $('.' + prefix + 'modal-title', $modal)
                                                    .after(
                                                        $('<div/>', {
                                                            'class': prefix + 'progress'
                                                        }).append(
                                                            $('<div/>', {
                                                                'class': prefix + 'progress-bar'
                                                            })
                                                        )
                                                    );
                                            }

                                            $.ajax({
                                                url: res.url,
                                                type: 'POST',
                                                data: templateFormData,
        
                                                progressUpload: function (e) {
                                                    $('.' + prefix + 'progress-bar').css('width', Math.round(e.loaded * 100 / e.total) + '%');
                                                },
        
                                                success: function (data) {
                                                    if (trumbowyg.o.plugins.upload.success) {
                                                        trumbowyg.o.plugins.upload.success(data, trumbowyg, $modal, values);
                                                    } else {
                                                        if (!!getDeep(data, trumbowyg.o.plugins.upload.statusPropertyName.split('.'))) {
                                                            var url = getDeep(data, trumbowyg.o.plugins.upload.urlPropertyName.split('.'));
                                                            trumbowyg.execCmd('insertImage', url);
                                                            var $img = $('img[src="' + url + '"]:not([alt])', trumbowyg.$box);
                                                            $img.attr('alt', values.alt);
                                                            if (trumbowyg.o.imageWidthModalEdit && parseInt(values.width) > 0) {
                                                                $img.attr({
                                                                    width: values.width
                                                                });
                                                            }
                                                            setTimeout(function () {
                                                                trumbowyg.closeModal();
                                                            }, 250);
                                                            trumbowyg.$c.trigger('tbwuploadsuccess', [trumbowyg, data, url]);
                                                        } else {
                                                            trumbowyg.addErrorOnModalField(
                                                                $('input[type=file]', $modal),
                                                                trumbowyg.lang[data.message]
                                                            );
                                                            trumbowyg.$c.trigger('tbwuploaderror', [trumbowyg, data]);
                                                        }
                                                    }
                                                },
        
                                                error: trumbowyg.o.plugins.upload.error || function () {
                                                    trumbowyg.addErrorOnModalField(
                                                        $('input[type=file]', $modal),
                                                        trumbowyg.lang.uploadError
                                                    );
                                                    trumbowyg.$c.trigger('tbwuploaderror', [trumbowyg]);
                                                }
                                            });
                                        })
                                        .fail(function() {
                                            alert( "error getting the S3key" );
                                        });
                                    }
                                );
    
                                $('input[type=file]').on('change', function (e) {
                                    try {
                                        // If multiple files allowed, we just get the first.
                                        file = e.target.files[0];
                                    } catch (err) {
                                        // In IE8, multiple files not allowed
                                        file = e.target.value;
                                    }
                                });
                            }
                        };
    
                        trumbowyg.addBtnDef('upload', btnDef);
                    }
                }
            }
        });
    
    
        function addXhrProgressEvent() {
            
            if (!$.trumbowyg.addedXhrProgressEvent) {   // Avoid adding progress event multiple times
                var originalXhr = $.ajaxSettings.xhr;
                $.ajaxSetup({
                    xhr: function () {
                        var req = originalXhr(),
                            that = this;
                        if (req && typeof req.upload === 'object' && that.progressUpload !== undefined) {
                            req.upload.addEventListener('progress', function (e) {
                                that.progressUpload(e);
                            }, false);
                        }
    
                        return req;
                    }
                });
                $.trumbowyg.addedXhrProgressEvent = true;
            }
        }
    }
})(window);
