# -*- coding:utf-8 -*-
import views
from django.conf.urls import patterns,url

urlpatterns=patterns('',
    url(r'^$',views.login_user),
    url(r'^register/$',views.register),
    url(r'^u/(?P<username>.+)/$',views.user_chat),
    url(r'^choose-chat/$',views.get_chat_record),
    url(r'^send-utu-message/$',views.send_utu_chat),
    url(r'^get-more-records/$',views.get_chat_record),
    url(r'^polling/$',views.polling),
    url(r'^check-someone-messages/',views.check_someone_messages),
)