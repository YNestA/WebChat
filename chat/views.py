# -*- coding:utf-8 -*-
from django.shortcuts import render,render_to_response,HttpResponseRedirect,HttpResponse
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login
from tools import check_register
import json
from django.contrib.auth.models import User
from django.http import Http404
from models import *
from datetime import datetime
import json

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

    return HttpResponse()


@login_required(login_url="/login")
def user_chat(request,username):
    if request.method=='GET':
        not_read=request.user.user_profile.get_not_read()
        res,lastest=[],[]
        for record in not_read:
            if record.from_user not in lastest:
                res.append([record,1])
                lastest.append(record.from_user)
            else:
                for x in res:
                    if x[0].from_user==record.from_user:
                        x[1]+=1
                        break
        dialogs=[{
            'img': x[0].from_user.user_profile.head_img,
            'name': x[0].from_user.username,
            'time':trans_left_dialog_time(x[0].time),
            'message':x[0].content,
            'count':x[1],
        } for x in res]
        friends=[{
            'img':friend.user_profile.head_img,
            'name':friend.username,
         }for friend in request.user.user_profile.friends.all()]
        return render_to_response('chat.html',{'dialogs':dialogs,'friends':friends},context_instance=RequestContext(request),)
    return render_to_response('chat.html',context_instance=RequestContext(request),)

def choose_chat(request):
    if request.method=='POST':
        try:
            from_user=User.objects.get(username=request.POST.get('username',''))
            dialogs,json_dict=request.user.user_profile.get_chat_user(from_user),{'res':'success','dialogs':[]}
            for dialog in dialogs:
                dialog_dict={'time':trans_right_dialog_time(dialog[0].time),
                             'messages':[],}
                for message in dialog:
                    dialog_dict['messages'].append({
                        'name':message.from_user.username,
                        'head':message.from_user.user_profile.head_img,
                        'content':message.content,
                        'time':message.time.strftime('%Y-%m-%d %H:%M:%S'),
                    })
                json_dict['dialogs'].append(dialog_dict)
            return HttpResponse(json.dumps(json_dict))
        except Exception as e:
            print e
            return HttpResponse(json.dumps({'res':'fail'}))
    return HttpResponse('You shall not pass!')
