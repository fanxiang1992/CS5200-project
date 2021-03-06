// (function () { // IIFE

  trainly.config(Config);
  trainly.controller("DashboardController", DashboardController);
  trainly.controller("CourseController", CourseController);
  trainly.controller("MyCourseController", MyCourseController);
  trainly.controller("CourseDetailController", CourseDetailController);
  trainly.controller("LoginController", LoginController);
  trainly.controller("RegisterController", RegisterController);
  trainly.controller("AuthenticateController", AuthenticateController);
  trainly.controller("HistoryController", HistoryController);
  trainly.controller("CertificateController", CertificateController);

  function RegisterController($scope, $routeParams, apiService, $location) {
    $scope.register = function() {
      apiService.register($scope.model.email, $scope.model.password, $scope.model.fname,
        $scope.model.lname, $scope.model.street, $scope.model.city, $scope.model.country, $scope.model.zipcode)
      .then(function(response) {
        $scope.user = response.data[0].data[0];
        $scope.registerError = "";
        if($scope.model.isAdmin) {
          apiService.registerAdmin($scope.model.email)
          .then(function(response) {
            $location.path('user/' + $scope.user.user_id)
          })
        }
        if ($scope.model.isFaculty) {
          apiService.registerFaculty($scope.model.email, $scope.model.title, $scope.model.affiliation, $scope.model.website)
          .then(function(response) {
            $location.path('user/' + $scope.user.user_id);

          })
        } else {
          $location.path('user/' + $scope.user.user_id);
        }
      })
      .catch(function(error) {
        console.log(error);
        $scope.registerError = error.data;
      });
    }
  }

  function LoginController($scope, $routeParams, apiService, $location) {
    $scope.login = function() {
      apiService.login($scope.model.username, $scope.model.password)
      .then(function(response) {
        $scope.user = response.data[0].data[0];
        $scope.loginError = "";
        $location.path('user/' + $scope.user.user_id);
      })
      .catch(function(error) {
        console.log(error);
        $scope.loginError = error.data;
      });
    }
  }


  function DashboardController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getUserById($scope.user_id)
    .then(function(response) {
      $scope.user = response.data[0].data[0];
    //$scope.buttons = ['Look Up Courses', 'Enrolled Courses', 'Playlist', 'Account History']
  });
  }

  function MyCourseController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getMyCourses($scope.user_id)
    .then(function(response) {
      $scope.mycourses = response.data[0].data;
    });

    apiService.getMyInterestedCourses($scope.user_id)
    .then(function(response) {
      $scope.myinterestedcourses = response.data[0].data;
    });
  }

  function HistoryController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getHistory($scope.user_id)
    .then(function(response) {
      $scope.historylist = response.data[0].data;
    });

    apiService.getTotalCost($scope.user_id)
    .then(function(response) {
      $scope.cost = response.data[0].data[0];
    });
  }

  function CertificateController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    $scope.course_id = $routeParams.cid;
    apiService.getCertificate($scope.user_id, $scope.course_id)
    .then(function(response) {
      $scope.certificate = response.data[0].data[0];
    })
  }

  // function CourseDetailController($scope, $routeParams, apiService, $location) {
  //   $scope.user_id = $routeParams.uid;
  //   $scope.course_id = $routeParams.cid;
  //   $scope.getIncompletedMaterials = function(uid, cid) {
  //     apiService.getIncompletedMaterials(uid, cid)
  //     .then(function(response) {
  //       $scope.incompletedmaterials = response.data[0].data;
  //       console.log($scope.incompletedmaterials);
  //     });
  //   }

  function AuthenticateController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;

    $scope.getFacultyWL = function(uid) {
      apiService.getFacultyWL(uid)
      .then(function(response) {
        $scope.facultylist = response.data[0].data;
      });
    }

    $scope.getAdminWL = function(uid) {
      apiService.getAdminWL(uid)
      .then(function(response) {
        $scope.adminlist = response.data[0].data;
      });
    }

    $scope.getFacultyWL($scope.user_id);
    $scope.getAdminWL($scope.user_id);

    $scope.authenticateFaculty = function(faculty) {
      apiService.authenticateFaculty($scope.user_id, faculty.faculty_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("You have approved this user as faculty!")
          console.log("success");
          $scope.getFacultyWL($scope.user_id);
          $scope.getAdminWL($scope.user_id);
        }
        else {
          console.log("error");
        }


      });
    }

    $scope.authenticateAdmin = function(admin) {
      apiService.authenticateAdmin($scope.user_id, admin.admin_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("You have approved this user as admin!")
          console.log("success");
          $scope.getFacultyWL($scope.user_id);
          $scope.getAdminWL($scope.user_id);
        }
        else {
          console.log("error");
        }


      });
    }


  }

  function CourseController($scope, apiService, $routeParams) {
    $scope.user_id = $routeParams.uid;
    $scope.getAllCourses = function(uid) {
      apiService.getAllCourses(uid)
      .then(function(response) {
        $scope.courses = response.data[0].data;
      });
    }

    $scope.enrollCourse = function(course) {
      apiService.enrollCourse($routeParams.uid, course.course_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("Successfully enrolled course " + course.name);
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.interestcourse = function(cid) {
      apiService.interestACourse($routeParams.uid, cid)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.disinterestCourse = function(cid) {
      apiService.disinterestCourse($routeParams.uid, cid)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }


    $scope.getAllCourses($routeParams.uid);
  }

  function CourseDetailController($scope, $routeParams, apiService, $location) {
    $scope.user_id = $routeParams.uid;
    $scope.course_id = $routeParams.cid;
    $scope.getIncompletedMaterials = function(uid, cid) {
      apiService.getIncompletedMaterials(uid, cid)
      .then(function(response) {
        $scope.incompletedmaterials = response.data[0].data;
        console.log($scope.incompletedmaterials);
      });
    }
    
    $scope.getCompletedMaterials = function(uid, cid) {
      apiService.getCompletedMaterials(uid, cid)
      .then(function(response) {
        $scope.completedmaterials = response.data[0].data;
        console.log($scope.completedmaterials);
      });
    }
    $scope.getProgress = function(uid, cid) {
      apiService.getProgress(uid, cid)
      .then(function(response) {
        $scope.progress = response.data[0].data[0];
        $scope.percentage = (parseInt($scope.progress.completed_count) / parseInt($scope.progress.total_count) * 100).toFixed(2)
      });
    }

    $scope.getIncompletedMaterials($scope.user_id, $scope.course_id);
    $scope.getCompletedMaterials($scope.user_id, $scope.course_id);
    $scope.getProgress($scope.user_id, $scope.course_id);

    $scope.replaceUrl = function(url) {
      return url.replace("watch?v=", "embed/");
    }

    $scope.completeMaterial = function(material) {
      apiService.completeMaterial($scope.user_id, material.incompleted_material_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          console.log("success");
          $scope.getIncompletedMaterials($scope.user_id, $scope.course_id);
          $scope.getCompletedMaterials($scope.user_id, $scope.course_id);
          $scope.getProgress($scope.user_id, $scope.course_id);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.completeCourse = function() {
      apiService.completeCourse($scope.user_id, $scope.course_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("You have completed this course!")
          $location.path('user/' + $scope.user_id + '/mycourses');
        }
        else {
          console.log("error");
        }
      });
    }
  }

  function Config($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "frontend/templates/login.html",
      controller: "LoginController",
      controllerAs: "model"
    })
    .when("/register", {
      templateUrl: "frontend/templates/register.html",
      controller: "RegisterController",
      controllerAs: "model"
    })
    .when("/user/:uid", {
      templateUrl: "frontend/templates/dashboard.html",
      controller: "DashboardController",
      controllerAs: "model"
    })
    .when("/user/:uid/courses", {
      templateUrl: "frontend/templates/courses.html",
      controller: "CourseController",
      controllerAs: "model"
    })
    .when("/user/:uid/mycourses", {
      templateUrl: "frontend/templates/mycourses.html",
      controller: "MyCourseController",
      controllerAs: "model"
    })
    .when("/user/:uid/course/:cid", {
      templateUrl: "frontend/templates/coursedetail.html",
      controller: "CourseDetailController",
      controllerAs: "model"
    })
    .when("/user/:uid/authenticate", {
      templateUrl: "frontend/templates/authenticate.html",
      controller: "AuthenticateController",
      controllerAs: "model"
    })
    .when("/user/:uid/history", {
      templateUrl: "frontend/templates/history.html",
      controller: "HistoryController",
      controllerAs: "model"
    })
    .when("/user/:uid/course/:cid/certificate", {
      templateUrl: "frontend/templates/certificate.html",
      controller: "CertificateController",
      controllerAs: "model"
    })

  }

// })();