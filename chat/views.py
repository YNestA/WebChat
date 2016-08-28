# -*- coding:utf-8 -*-
from django.shortcuts import render,render_to_response,HttpResponseRedirect,HttpResponse
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login
from  tools import check_register
import json
from django.contrib.auth.models import User
from django.http import Http404

def homepage(request):
    return login_user(request);


def login_user(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('webchat/u/'+request.user.username)
    elif request.method=='POST':
        username,password=request.POST.get('username',''),request.POST.get('password','')
        user=authenticate(username=username,password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
            return HttpResponseRedirect('webchat/u/'+user.username)
        else:
            return render_to_response('login.html',{'login_error':'用户名或密码错误'},context_instance=RequestContext(request))
    return render_to_response('login.html',context_instance=RequestContext(request),)

def register(request):
    if request.method=='POST':
        username,password,passwordR,email=request.POST.get('username',''),request.POST.get('password',''),request.POST.get('passwordR',''),request.POST.get('email','')
        check_res=check_register(username,password,passwordR,email)
        if check_res=='True':
            user=User.objects.create_user(username,email,password)
            user.save()
            user=authenticate(username=username,password=password)
            login(request,user)
            the_json=json.dumps({
                'success':'True',
                'userURL':'/webchat/u/'+username,
            })
            return HttpResponse(the_json)
        else:
            the_json=json.dumps({
                'success':'False',
                'errorName':check_res[0],
                'message':check_res[1],
            })
            return HttpResponse(the_json)

    return HttpResponse("hello")


@login_required(login_url="/login")
def user_chat(request,username):

    return HttpResponse("hello,"+request.user.username)