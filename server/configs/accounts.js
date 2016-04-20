   Meteor.startup(function () {
   	Accounts.emailTemplates.siteName = "GoPredict.com";

   	Accounts.emailTemplates.from = "GoPredict.com <info@lazygalaxy.com>";

   	Accounts.emailTemplates.resetPassword.text = function (user, url) {
   		var token = url.substring(url.lastIndexOf('/') + 1, url.length);
   		var newUrl = Meteor.absoluteUrl('resetPassword/' + token);
   		var str = 'Hello ' + user.username + ',\n';
   		str += '\n';
   		str += 'To reset your password, simply click the link below.\n';
   		str += '\n';
   		str += newUrl + '\n';
   		str += '\n';
   		str += 'Thanks,\n';
   		str += 'GoPredict.com\n';

   		return str;
   	}

   	Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   		var token = url.substring(url.lastIndexOf('/') + 1, url.length);
   		var newUrl = Meteor.absoluteUrl('verifyEmail/' + token);
   		var str = 'Hello ' + user.username + ',\n';
   		str += '\n';
   		str += 'To verify your account email, simply click the link below.\n';
   		str += '\n';
   		str += newUrl + '\n';
   		str += '\n';
   		str += 'Thanks,\n';
   		str += 'GoPredict.com\n';

   		return str;
   	}
   });
