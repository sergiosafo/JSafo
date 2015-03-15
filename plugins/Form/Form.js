JSafo.plugins.Form = function(form)
{
	if(form.tagName == "FORM")
	{
		var optArr = new Array();
		var onSubmit = form.getAttribute("onsubmit");
		var ajaxData = "cache="+Math.random();
		var fieldError;
		
		function validateGroup(name)
		{
			var fields = form.getElementsByName(name);
			var checked = false;
			
			JSafo.foreach(fields, function(field)
			{
				if(field.checked) {checked = true;}
			});
			
			return checked;
		}
		
		function validate(field)
		{
			var classes = field.className.split(" ");
			var isValid = true;
			
			if(classes.indexOf("req") >= 0)
			{
				if(field.type == "checkbox" || field.type == "radio")
				{
					isValid = validateGroup(field.name);
				}
				else
				{
					if(classes.indexOf("name") >= 0)
					{
						regex = /\w{3,}/;
					}
					else if(classes.indexOf("login") >= 0)
					{
						regex = /^\w{3,}$/;
					}
					else if(classes.indexOf("tel") >= 0)
					{
						regex = /\(\d\d\) \d{4,5}-\d{4}/;
					}
					else if(classes.indexOf("filepath") >= 0)
					{
						regex = /^[\w\/\\\_\-\:\~]+\.{1}\w{3,4}$/;
					}
					else if(classes.indexOf("email") >= 0)
					{
						regex = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/;
					}
					else {regex = /\w{1,}/;}
					
					isValid = regex.test(field.value);
				}
			}
			
			setField(field, isValid);
		}
		
		function setField(field, isValid)
		{
			if(isValid)
			{
				field.className = field.className.replace(" error", "");
			}
			else
			{
				if(!fieldError)
				{
					fieldError = field;
					field.focus();
				}
				
				field.className = field.className + " error";
			}
		}
		
		function onlyNumber(key)
		{
			return (key > 47 && key < 58) || key == 8 || key == 0;
		}
		
		function formatByKey(field, funct)
		{
			field.onkeypress = function(e)
			{
				key = window.event? window.event.keyCode : e.which;
				return funct(key);
			};
		}
		
		function format(field)
		{
			var classes = field.className.split(" ");
			
			if(classes.indexOf("tel") >= 0)
			{
				formatByKey(field, onlyNumber);
				
				field.maxLength	= 15;
				field.onkeyup	= function()
				{
					this.value = this.value.replace("-", "");
					this.value = this.value.replace(/^(\d\d)(\d)/g,"($1) $2");
					this.value = this.value.replace(/(\d{4,5})(\d{4})$/g,"$1-$2");
				};
			}
			if(classes.indexOf("num") >= 0)
			{
				formatByKey(field, onlyNumber);
			}
		}
		
		function setFields(funct)
		{
			for(var i=0; i < form.elements.length; i++)
			{
				if(form.elements[i].name && form.elements[i].className)
				{
					funct(form.elements[i]);
				}
			}
		}
		
		function submitForm(option)
		{
			if(option == optArr[0])
			{
				JSafo.Loader();
				form.submit();
				if(onSubmit) {eval(onSubmit);}
			}
		}
		
		form.ask = function(question, options)
		{
			if(question && options)
			{
				fieldError = null;
				setFields(validate);
				
				if(!fieldError)
				{
					optArr = options.split("|");
					JSafo.Alert(form.title, question, options, submitForm);
				}
			}
		};
		
		form.onsubmit = function()
		{
			return false;
		};
		
		setFields(format);
	}
};